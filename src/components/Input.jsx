/**
 * Our standard Input (text box) component.
 * Having a shared component like this makes sure every form on our site looks the same!
 */
export default function Input({ 
  id,           // The ID of the input, used for labels
  label,        // The text we show above the input box
  error,        // Any error message to show below the input
  className = "", // Extra styles if needed
  ...props      // Other standard input attributes (like value, onChange, placeholder)
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* If we provided a label, we show it here */}
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}

      {/* The actual text input box */}
      <input
        id={id}
        // We change the border color if there's an error!
        className={`rounded-lg border px-3.5 py-2.5 text-sm transition-colors
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-red-500/50"
              : "border-stone-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-stone-600 dark:bg-stone-800 dark:text-white dark:focus:border-brand-400 dark:focus:ring-brand-400"
          } 
          focus:outline-none disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-900 placeholder:text-stone-400 dark:placeholder:text-stone-500`}
        {...props}
      />

      {/* If there's an error message, we display it in red below the input */}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
