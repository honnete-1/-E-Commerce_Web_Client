// A simple Card wrapper for product and cart item content
export default function Card({ 
  className = "",
  children,
  ...props
}) {
  return (
    <div
      className={`rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
