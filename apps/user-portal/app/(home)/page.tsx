"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosFetch from "../../utils/axiosFetch";
import { COUPON_APIS } from "../../config/api";
import toast from "react-hot-toast";
import { CouponCard, CouponProps } from "../../components/CouponCard";

export default function CouponsPage() {
  const [couponCode, setCouponCode] = useState<any>("");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [redeemedCoupon, setRedeemedCoupon] = useState<any>(null);

  // ✅ Fetch coupon only when "View" is clicked
  const couponQuery = useQuery({
    queryKey: ["coupon-details", couponCode],
    queryFn: async () => {
      const res: any = await axiosFetch({
        url: COUPON_APIS.GET_COUPON_DETAILS(couponCode), // GET /coupons/:code
        method: "get",
      });
      console.log("res",res)
      if (!res.data.success) {
        toast.error(res?.data.message);

        throw new Error(res.data.message);
      }
      return res.data.coupon;
    },
    enabled: false, // prevents auto-fetch
  });

  // ✅ Redeem Mutation (POST + send couponId + orderAmount)
  const redeemMutation : any = useMutation({
    mutationFn: async (coupon: CouponProps) => {
      const res = await axiosFetch({
        url: COUPON_APIS.Redeem_COUPON(couponCode), // POST /coupons/redeem/:code
        method: "post",
        data: {
          couponId: coupon.id, // ✅ sending id properly
          orderAmount: 100, // ✅ static for now
        },
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      console.log("Redeem done:", data);
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

        {/* ✅ Redeem Button (only after view) */}
        <button
          onClick={() => redeemMutation.mutate(selectedCoupon!)}
          disabled={!selectedCoupon || redeemMutation.isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {redeemMutation.isLoading ? "Redeeming..." : "Redeem"}
        </button>

        {/* ✅ Show Coupon Preview */}
        {selectedCoupon && !redeemedCoupon && (
          <div className="mt-4 w-full flex justify-center">
            <CouponCard {...selectedCoupon} />
          </div>
        )}

        {/* ✅ Show Redeemed Coupon */}
        {redeemedCoupon && (
          <div className="mt-6 w-full flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">🎉 Redeemed Coupon</h3>
            <p>{redeemedCoupon?.message}</p>
            <p>discount : {redeemedCoupon.discount}</p>
          </div>
        )}
      </div>
    </main>
  );
}
