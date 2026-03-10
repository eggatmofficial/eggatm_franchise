export default function Modal({ open, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-5 rounded">
        {children}
      </div>
    </div>
  );
}
