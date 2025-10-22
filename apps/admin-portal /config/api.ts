export const COUPON_APIS = {
  // ✅ Fetch all coupons (add pagination/filter/search later if needed)
  GET_ALL_COUPONS: () => `/api/admin/coupons`,

  // ✅ Fetch single coupon by code or id
  GET_COUPON_BY_ID: (id: string) => `/coupons/${id}`,

  // ✅ Create coupon
  CREATE_COUPON: `/api/admin/coupons`,

  // ✅ Update coupon
  UPDATE_COUPON: (id: string) => `/coupons/${id}`,

  // ✅ Delete coupon
  DELETE_COUPON: (id: string) => `/coupons/${id}`,
};