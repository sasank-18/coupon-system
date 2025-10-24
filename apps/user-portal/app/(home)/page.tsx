"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosFetch from "../../utils/axiosFetch";
import { COUPON_APIS } from "../../config/api";
import toast from "react-hot-toast";
import { CouponCard, CouponProps } from "../../components/CouponCard";
import QRCode from "react-qr-code"; // ✅ For generating QR code

export default function CouponsPage() {
  const [couponCode, setCouponCode] = useState<any>("");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [redeemedCoupon, setRedeemedCoupon] = useState<any>(null);

  // ✅ Fetch coupon only when "View" is clicked
  const couponQuery = useQuery({
    queryKey: ["coupon-details", couponCode],
    queryFn: async () => {
      const res: any = await axiosFetch({
        url: COUPON_APIS.GET_COUPON_DETAILS(couponCode),
        method: "get",
      });
      if (!res.data.success) {
        toast.error(res?.data.message);
        throw new Error(res.data.message);
      }
      return res.data.coupon;
    },
    enabled: false,
  });

  // ✅ Redeem Mutation
  const redeemMutation: any = useMutation({
    mutationFn: async (coupon: CouponProps) => {
      const res = await axiosFetch({
        url: COUPON_APIS.Redeem_COUPON(couponCode),
        method: "post",
        data: {
          couponId: coupon.id,
          orderAmount: 100,
        },
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success("🎉 Coupon Redeemed Successfully!");
        setRedeemedCoupon(data);
        setCouponCode("");
        setSelectedCoupon(null);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  console.log(redeemMutation)

  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Apply Coupon</h2>

        {/* ✅ Input + View Button */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setSelectedCoupon(null);
              setRedeemedCoupon(null);
            }}
            placeholder="Enter coupon code"
            className="border px-4 py-2 rounded-md w-72"
          />

          <button
            onClick={async () => {
              try {
                const res = await couponQuery.refetch();
                if (res.data) {
                  toast.success("✅ Coupon Found!");
                  setSelectedCoupon(res.data);
                }
              } catch (e: any) {
                toast.error(e.message || "Coupon not found");
                setSelectedCoupon(null);
              }
            }}
            disabled={!couponCode || couponQuery.isFetching}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {couponQuery.isFetching ? "Loading..." : "View"}
          </button>
        </div>

        {/* ✅ Show QR Code + Redeem button */}
        {selectedCoupon && !redeemedCoupon && (
          <div className="mt-4 flex flex-col items-center gap-4">
            <CouponCard {...selectedCoupon} />

            {/* ✅ QR Code Generated from Coupon Code/Id */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <QRCode
                value={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/${selectedCoupon.code}/redeem`}
                size={200}
              />
            </div>
            <p className="text-sm text-gray-600">Scan this QR to Redeem</p>

            {/* ✅ OR Redeem Manually */}
            <button
              onClick={() => redeemMutation.mutate(selectedCoupon!)}
              disabled={redeemMutation.status === "pending"}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {redeemMutation.status === "pending" ? "Redeeming..." : "Redeem Manually"}
            </button>
          </div>
        )}

        {/* ✅ Show Redeemed Result */}
        {redeemedCoupon && (
          <div className="mt-6 w-full flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">🎉 Redeemed Coupon</h3>
            <p>{redeemedCoupon?.message}</p>
            <p>Discount: ₹{redeemedCoupon.discount}</p>
          </div>
        )}
      </div>
    </main>
  );
}
