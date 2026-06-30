// My standard text input, shared so every form looks consistent
export default function Input({ 
  id,
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`rounded-lg border px-3.5 py-2.5 text-sm transition-colors
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-red-500/50"
              : "border-stone-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-stone-600 dark:bg-stone-800 dark:text-white dark:focus:border-brand-400 dark:focus:ring-brand-400"
          } 
          focus:outline-none disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-900 placeholder:text-stone-400 dark:placeholder:text-stone-500`}
        {...props}
      />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
