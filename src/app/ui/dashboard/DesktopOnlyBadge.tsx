export function DesktopOnlyBadge() {
  return (
    <aside className="fixed bottom-3 right-3 z-[5000] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#009075] text-white text-xs font-semibold shadow-md select-none pointer-events-none">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21h8M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>Desktop only &middot; &ge;1024px</span>
    </aside>
  );
}