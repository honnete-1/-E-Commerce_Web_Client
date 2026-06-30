// My button style variants
const VARIANTS = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-300 disabled:bg-brand-200 " + 
    "dark:bg-brand-600 dark:hover:bg-brand-500 dark:disabled:bg-brand-800 shadow-sm hover:shadow",
  secondary:
    "bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 focus-visible:ring-stone-300 disabled:text-stone-400 " + 
    "dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600 dark:hover:bg-stone-700 shadow-sm",
  danger:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus-visible:ring-red-300 disabled:text-red-300 " +
    "dark:bg-stone-800 dark:text-red-400 dark:border-red-900 dark:hover:bg-stone-700 shadow-sm",
  ghost:
    "bg-transparent text-stone-700 hover:bg-stone-100 focus-visible:ring-stone-300 " +
    "dark:text-stone-300 dark:hover:bg-stone-800",
};

// My button size variants
const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

// My shared button used everywhere instead of a raw <button>
export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-stone-900
        disabled:cursor-not-allowed active:scale-95
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
