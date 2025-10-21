"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCouponSchema } from "@repo/common/types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast"; // optional, for notifications
import axiosFetch from "../../../../utils/axiosFetch";
import { COUPON_APIS } from "../../../../config/api";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";


type CouponFormData = z.infer<typeof createCouponSchema>;

export default function CouponForm() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormData>({
    // @ts-ignore
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      discount_type: "FIXED",
      max_redemptions: 1,
      redemptions_used: 0,
      status: "active",
    },
  });

  const discountType = watch("discount_type");
  const router = useRouter();
  // React Query Mutation for creating coupon
  const mutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      return axiosFetch<CouponFormData>({
        url: COUPON_APIS.CREATE_COUPON,
        method: "post",
        data,
      });
    },
    onMutate: () => setSubmitting(true),
    onError: (error: any) => {
      setSubmitting(false);
      toast.error(error?.message || "Failed to create coupon");
    },
    onSuccess: (res) => {
      setSubmitting(false);
      toast.success("Coupon created successfully!");
      reset();
      router.push("/")

    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    // If discount type is PERCENT, ensure max_discount is provided
    if (data.discount_type === "PERCENT" && !data.max_discount) {
      toast.error("Max discount is required for percentage discounts");
      return;
    }

    // Call the mutation to create the coupon
    console.log("Submitting data:", data);
    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6">Create New Coupon</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Coupon Code */}
        <div>
          <label className="block text-gray-700">Coupon Code</label>
          <input
            type="text"
            {...register("code")}
            placeholder="Leave empty for auto-generated"
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            {...register("description")}
            className="mt-1 block w-full border rounded-md p-2"
            rows={2}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Valid From / To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Valid From</label>
            <input
              type="date"
              {...register("valid_from")}
              className="mt-1 block w-full border rounded-md p-2"
            />
            {errors.valid_from && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_from.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Valid To</label>
            <input
              type="date"
              {...register("valid_to")}
              className="mt-1 block w-full border rounded-md p-2"
            />
            {errors.valid_to && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_to.message}</p>
            )}
          </div>
        </div>

        {/* Discount Type */}
        <div>
          <label className="block text-gray-700">Discount Type</label>
          <select
            {...register("discount_type")}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="FIXED">Fixed</option>
            <option value="PERCENT">Percentage</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-gray-700">Discount Value</label>
          <input
            type="number"
            {...register("discount_value", { valueAsNumber: true })}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.discount_value && (
            <p className="text-red-500 text-sm mt-1">{errors.discount_value.message}</p>
          )}
        </div>

        {/* Max Discount (only for PERCENT) */}
        {discountType === "PERCENT" && (
          <div>
            <label className="block text-gray-700">Max Discount (Optional)</label>
            <input
              type="number"
              {...register("max_discount", { valueAsNumber: true })}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
        )}

        {/* Max Redemptions */}
        <div>
          <label className="block text-gray-700">Max Redemptions</label>
          <input
            type="number"
            {...register("max_redemptions", { valueAsNumber: true })}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.max_redemptions && (
            <p className="text-red-500 text-sm mt-1">{errors.max_redemptions.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700">Status</label>
          <select
            {...register("status")}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="redeemed_out">Redeemed Out</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`mt-4 w-full text-white px-6 py-2 rounded-md transition ${
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {submitting ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
}
