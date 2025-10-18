import { Request, Response } from "express";
import prisma from "../config/db";

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon) return res.status(404).json({ success: false, message: "Invalid code" });

    const now = new Date();
    if (now < coupon.valid_from || now > coupon.valid_to)
      return res.status(400).json({ success: false, message: "Coupon expired" });

    if (coupon.redemptions_used >= coupon.max_redemptions)
      return res.status(400).json({ success: false, message: "Already used" });

    let discount = coupon.discount_value;
    if (coupon.discount_type === "percentage" && coupon.max_discount) {
      discount = Math.min(discount, coupon.max_discount);
    }

    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { redemptions_used: coupon.redemptions_used + 1 },
    });

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.discount_type,
        discount_value: discount,
      },
      message: `You saved ₹${discount}!`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};





















































