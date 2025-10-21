// app/components/CouponCard.tsx

export interface CouponProps {
  code: string;
  description?: string;
  discount_type: "FIXED" | "PERCENT";
  discount_value: number;
  max_discount?: number;
  max_redemptions: number;
  redemptions_used?: number;
  valid_from: string | Date; // ✅ Accept both
  valid_to: string | Date;   // ✅ Accept both
  status: "active" | "expired" | "redeemed_out" | "inactive";
}

export const CouponCard = ({
  code,
  description,
  discount_type,
  discount_value,
  max_discount,
  max_redemptions,
  redemptions_used = 0,
  valid_from,
  valid_to,
  status,
}: CouponProps) => {
const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));


  const statusStyles = {
    active: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700",
    redeemed_out: "bg-yellow-100 text-yellow-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 border hover:border-blue-400 transition">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">{code || "Auto-generated"}</h2>
        <span className={`px-2 py-1 text-sm rounded ${statusStyles[status]}`}>
          {status.replace("_", " ").toUpperCase()}
        </span>
      </div>
      <p className="text-gray-600 mt-1">{description || "No description"}</p>
      <div className="mt-3 text-sm text-gray-700 space-y-1">
        <p>
          <strong>Discount:</strong>{" "}
          {discount_type === "FIXED"
            ? `₹${discount_value} OFF`
            : `${discount_value}% OFF${max_discount ? ` (Max ₹${max_discount})` : ""}`}
        </p>
        <p>
          <strong>Valid:</strong> {formatDate(valid_from)} - {formatDate(valid_to)}
        </p>
        <p>
          <strong>Usage:</strong> {redemptions_used}/{max_redemptions} redeemed
        </p>
      </div>
    </div>
  );
};
