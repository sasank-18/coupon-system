import { z } from "zod";

// Matches your Prisma Coupon model exactly
export const createCouponSchema = z.object({
  code: z.string().min(1).max(50).optional(), // optional, allow auto-gen
  description: z.string().max(500).optional(),
  valid_from: z.string().transform(s => new Date(s)),
  valid_to: z.string().transform(s => new Date(s)),
  discount_type: z.enum(["FIXED", "PERCENT"]),
  discount_value: z.number().positive(),
  max_discount: z.number().positive().optional(),
  max_redemptions: z.number().int().positive(),
  redemptions_used: z.number().int().nonnegative().optional().default(0), // default 0
  status: z.enum(["active", "expired", "redeemed_out", "inactive"]).optional().default("active")
})
.refine(data => data.valid_from < data.valid_to, {
  message: "valid_from must be earlier than valid_to",
  path: ["valid_from"]
});


export type CreateCouponInput = z.infer<typeof createCouponSchema>;


export const redeemCouponSchema = z.object({
  couponId: z.number().min(1),  // coupon code id
  orderAmount: z.number().positive()   ,
  amountOff : z.number().nonnegative()// ,to apply discount logic
});



export type RedeemCouponInput = z.infer<typeof redeemCouponSchema>;
