export default function PremiumInput({
  label,
  type = "text",
  name,
  value,
  onChange,
}) {
  const focused = value && value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        placeholder=" "
        onChange={onChange}
        required
        className="
          w-full px-4 pt-6 pb-2
          rounded-xl
          bg-white
          border border-gray-300
          outline-none
          transition-all duration-300
          focus:ring-4 focus:ring-[#F59E0B]/20
          focus:border-[#F59E0B]
        "
      />

      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none
        ${
          focused
            ? "top-1 text-xs text-[#F59E0B]"
            : "top-3 text-sm text-gray-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
