"use client";

export default function QuickAddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-24 right-6 z-50
        w-14 h-14 rounded-full 
        bg-pink-500 text-white text-3xl
        flex items-center justify-center
        shadow-xl
        active:scale-95 transition
      "
    >
      +
    </button>
  );
}
