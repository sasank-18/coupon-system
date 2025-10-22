"use client";

import { useQuery } from "@tanstack/react-query";
import { CouponCard, CouponProps } from "../../components/CouponCard";
import axiosFetch from "../../utils/axiosFetch";
import { COUPON_APIS } from "../../config/api";
import toast from "react-hot-toast";

// // Example dummy coupons matching createCouponSchema
// const dummyCoupons = [
//   {
//     code: "NEWYEAR50",
//     description: "Flat ₹50 off on all items",
//     discount_type: "FIXED",
//     discount_value: 50,
//     max_discount: undefined,
//     max_redemptions: 5,
//     redemptions_used: 0,
//     status: "active",
//     valid_from: new Date("2025-01-01"),
//     valid_to: new Date("2025-01-10"),
//   },
//   {
//     code: "SAVE10",
//     description: "10% discount on orders above ₹500",
//     discount_type: "PERCENT",
//     discount_value: 10,
//     max_discount: 100,
//     max_redemptions: 10,
//     redemptions_used: 0,
//     status: "expired",
//     valid_from: new Date("2025-01-01"),
//     valid_to: new Date("2025-01-15"),
//   },
// ];

export default function CouponsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      try {
        const { data } = await axiosFetch<any>({
          url: COUPON_APIS.GET_ALL_COUPONS(),
          method: "get",
        });

        console.log(data);
        if (!Array.isArray(data?.updatedCoupons) || !data?.success) {
          toast.error(data?.message);
          return [];
        }
        return data?.updatedCoupons;
      } catch (error: any) {
        toast.error(error.message);
        return [];
      }
    },
  });

  if (isLoading) return <div className="p-6 text-lg">Loading coupons...</div>;
  if (error)
    return (
      <div className="p-6 text-lg text-red-600">Failed to load coupons</div>
    );
  if (!data || data.length === 0)
    return <div className="p-6 text-lg">No coupons available</div>;

  return (
    <>
      <main className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">Available Coupons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((coupon: CouponProps) => (
            <CouponCard key={coupon.code} {...coupon} />
          ))}
        </div>
      </main>
    </>
  );
}
