/**
 * A simple Card component!
 * We use this to put content in a neat white (or dark!) box with a little shadow and rounded corners.
 * This makes our products and cart items look organized.
 */
export default function Card({ 
  className = "", // Extra styles we can add when we use the Card
  children,       // The content that goes inside the Card
  ...props        // Any other properties (like onClick)
}) {
  return (
    <div
      // 'bg-white' is for light mode, 'dark:bg-stone-800' is for dark mode!
      className={`rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
