import { Router } from "express";
import { getCoupon, redeemCoupon } from "../controllers/customerCoupon";

const router : Router = Router();

router.get("/coupons/:code", getCoupon);
router.get("/coupons/:code/redeem",redeemCoupon )

export default router;
