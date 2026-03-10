import { useState } from "react";

export default function Input({ label, type="text", name, onChange }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange && onChange(e);
  };

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        placeholder=" "
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(value !== "")}
        className="
          w-full px-4 pt-6 pb-2 rounded-xl
          bg-white/10 text-white
          border border-white/20
          outline-none
          transition-all duration-300
          focus:ring-4 focus:ring-[#F59E0B]/30
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
