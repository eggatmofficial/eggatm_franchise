export default function Button({ children, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="
        w-full h-12 rounded-xl
        bg-gradient-to-r from-[#F59E0B] to-[#FDBA74]
        text-black font-semibold
        flex items-center justify-center gap-2
        transition-all duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-70
      "
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      )}

      {loading ? "Signing In..." : children}
    </button>
  );
}
