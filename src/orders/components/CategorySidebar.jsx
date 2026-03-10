const categories = [
  "Starter",
  "Main Course",
  "Beverage",
  "Dessert"
];

export default function CategorySidebar() {
  return (
    <div className="p-3 space-y-2">
      {categories.map(cat => (
        <button
          key={cat}
          className="
            w-full text-left px-4 py-3
            rounded-lg
            hover:bg-blue-50
            hover:text-blue-600
            transition
          "
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
