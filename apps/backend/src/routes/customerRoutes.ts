import { Router } from "express";
import { getCoupon } from "../controllers/customerCoupon";

const router : Router = Router();

router.get("/coupons/:code", getCoupon);

export default router;
