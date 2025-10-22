import { Request, Response } from "express";
import prisma from "../config/db";
import { generateCouponCode } from "../utils/generateCouponCode";
import { createCouponSchema } from "@repo/common/types";
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const parsedData = createCouponSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: parsedData.error,
      });
    }

    const {
      code,
      description,
      valid_from,
      valid_to,
      discount_type,
      discount_value,
      max_discount,
      max_redemptions,
    } = parsedData.data;

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

    const updatedCoupons = coupons.map((data : any) => {
      if (data.status === "active" && new Date(data.valid_to) < new Date()) {
        return { ...data, status: "expired" };
      }
      return data;
    });

    await prisma.coupon.updateMany({
      where: {
        status: "active",
        valid_to: { lt: new Date() },
      },
      data: { status: "expired" },
    });

    res.json({ success: true, updatedCoupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
