import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3).max(50).optional(), // allow auto-gen
  description: z.string().max(500).optional(),
  validFrom: z.string().transform(s => new Date(s)),
  validTo: z.string().transform(s => new Date(s)),
  discountType: z.enum(["FIXED", "PERCENTAGE"]),
  discountValue: z.number().positive(),
  maxDiscountCap: z.number().positive().optional(),
  maxRedemptions: z.number().int().positive()
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
