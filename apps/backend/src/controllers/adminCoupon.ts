import { Request, Response } from "express";
import prisma from "../config/db";
import { generateCouponCode } from "../utils/generateCouponCode";

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, description, valid_from, valid_to, discount_type, discount_value, max_discount, max_redemptions } = req.body;

    const couponCode = code || generateCouponCode();

    const coupon = await prisma.coupon.create({
      data: {
        code: couponCode,
        description,
        valid_from: new Date(valid_from),
        valid_to: new Date(valid_to),
        discount_type,
        discount_value: Number(discount_value),
        max_discount: max_discount ? Number(max_discount) : null,
        max_redemptions: max_redemptions ? Number(max_redemptions) : 1,
      },
    });

    res.status(201).json({ success: true, coupon });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany();
    res.json({ success: true, coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
