import { Pencil, Trash2 } from "lucide-react";

export default function MenuCard({ item, onEdit, onDelete }) {
  if (!item) return null;
console.log("menu items",item);

  return (
    <div
      className="
        group
        bg-white
        rounded-xl
        border border-gray-200
        hover:border-indigo-200
        transition-colors
        duration-200
      "
    >
      {/* Card Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* ================= IMAGE ================= */}
          <div className="relative w-20 h-20 flex-shrink-0">
            {/* Image Container */}
            <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 ring-1 ring-gray-200 group-hover:ring-indigo-200 transition-all">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                {/* Category */}
                <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {item.category || "Uncategorized"}
                </span>

                {/* Name */}
                <h3 className="font-semibold text-gray-900 text-base mt-1.5">
                  {item.name}
                </h3>

                <p className="text-xs text-gray-500">
            Cost: ₹ {item.costPrice || 0}
            </p>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit?.(item)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label="Edit item"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete?.(item._id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              {/* Price */}
              <div className="flex items-baseline gap-0.5">
                <span className="text-sm font-medium text-gray-400">₹</span>
                <span className="text-lg font-semibold text-gray-900">
                  {item.price}
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`
                  text-xs font-medium px-2.5 py-1 rounded-md
                  ${
                    item.isAvailable
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-600"
                  }
                `}
              >
                {item.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}