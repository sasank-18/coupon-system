import { Router } from "express";
import { createCoupon, getAllCoupons } from "../controllers/adminCoupon";

const router : Router = Router();

router.post("/coupons", createCoupon);
router.get("/coupons", getAllCoupons);

export default router;
