export default function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  name
}) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
        className="
          peer w-full px-4 pt-5 pb-2
          rounded-xl border border-gray-200
          bg-white/70 backdrop-blur-sm
          focus:outline-none
          focus:ring-4 focus:ring-indigo-500/10
          focus:border-indigo-500
          transition-all duration-200
        "
      />

      <label
        className="
          absolute left-4 text-gray-500 text-sm
          transition-all duration-200
          peer-focus:text-xs peer-focus:top-1.5
          top-1.5 text-xs
        "
      >
        {label}
      </label>
    </div>
  );
}
