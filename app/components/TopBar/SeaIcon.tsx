/**
 * Sea / water icon for sea temperature label.
 */
export default function SeaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} text-sky-400`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}
