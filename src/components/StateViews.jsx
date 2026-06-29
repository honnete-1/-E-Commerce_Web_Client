import Button from "./Button";

export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
  icon = "📦",
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
      <span className="text-4xl" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-base font-semibold text-stone-800">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-stone-500">{description}</p>
      )}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <span className="text-4xl" aria-hidden="true">
        ⚠️
      </span>
      <h3 className="text-base font-semibold text-red-800">{title}</h3>
      {message && (
        <p className="max-w-sm text-sm text-red-600">{message}</p>
      )}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
