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


export const redeemCoupon = async (req : Request, res : Response) => {
  try {
    const { code } = req.params;
    const { billAmount, userId } = req.query;  // userId = optional, billAmount = required for % coupons

    if (!billAmount) {
      return res.status(400).json({ success: false, message: "billAmount is required to calculate discount" });
    }

    // 1. ✅ Find coupon by code
    const coupon = await prisma.coupon.findUnique({
      where: { code }
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or non-existing coupon code" });
    }

    // 2. ✅ Check coupon status & expiration
    const now = new Date();
    if (coupon.status !== "active") {
      return res.status(400).json({ success: false, message: "Coupon is not active" });
    }

    if (now < coupon.valid_from || now > coupon.valid_to) {
      return res.status(400).json({ success: false, message: "Coupon is expired or not valid at this time" });
    }

    // 3. ✅ Check redemption limit
    if (coupon.redemptions_used >= coupon.max_redemptions) {
      return res.status(400).json({ success: false, message: "Coupon has reached its maximum number of usages" });
    }

    // 4. ✅ Calculate discount
    let discountAmount = 0;
    const totalAmount = Number(billAmount);

    if (coupon.discount_type === "FIXED") {
      discountAmount = coupon.discount_value;
    } 
    else if (coupon.discount_type === "PERCENT") {
      const calculated = (coupon.discount_value / 100) * totalAmount;
      discountAmount = coupon.max_discount ? Math.min(calculated, coupon.max_discount) : calculated;
    }

    // 5. ✅ Save redemption & update coupon usage count
    await prisma.$transaction([
      // Save redemption record
      prisma.redemption.create({
        data: {
          couponId: coupon.id,
          amountOff: discountAmount
        },
      }),
      // Update coupon usage
      prisma.coupon.update({
        where: { id: coupon.id },
        data: { redemptions_used: coupon.redemptions_used + 1 }
      })
    ]);

    return res.json({
      success: true,
      message: `Coupon applied! You saved ₹${discountAmount}`,
      discount: discountAmount,
      coupon: { code: coupon.code, type: coupon.discount_type }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};



















































