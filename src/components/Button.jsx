// We define our different button styles here so they are easy to change later.
// The "dark:" classes tell Tailwind what color to use when Dark Mode is active!
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

// We define different sizes so we can have big buttons and small buttons easily.
const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

/**
 * Our main Button component!
 * We use this everywhere in the app instead of writing <button> directly.
 * It ensures all our buttons look consistent.
 */
export default function Button({
  variant = "primary", // Default to the 'primary' style
  size = "md",         // Default to the medium size
  isLoading = false,   // If true, shows a little spinning circle
  className = "",      // Allows us to pass extra styles if needed
  children,            // The text inside the button (e.g., "Add to Cart")
  disabled,            // If true, the button can't be clicked
  ...props             // Passes down any other props (like onClick)
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
      {/* If isLoading is true, we show this spinning circle */}
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      
      {/* This is the text or icons we put inside the Button when we use it */}
      {children}
    </button>
  );
}
