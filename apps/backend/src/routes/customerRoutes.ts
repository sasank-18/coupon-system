import { Router } from "express";
import { getCoupon, redeemCoupon } from "../controllers/customerCoupon";

const router : Router = Router();

router.get("/coupon/:code", getCoupon);
router.post("/coupons/:code/redeem",redeemCoupon )

export default router;
