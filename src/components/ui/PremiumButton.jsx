export default function PremiumButton({ children }) {
  return (
    <button
      type="submit"
      className="
        w-full h-12 rounded-xl
        bg-gradient-to-r from-[#F59E0B] to-[#FDBA74]
        text-black font-semibold
        transition-all duration-300
        hover:scale-[1.02]
        active:scale-[0.97]
      "
    >
      {children}
    </button>
  );
}
