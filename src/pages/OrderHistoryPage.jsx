import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { getGuestUserId } from "../utils/guestUser";
import Card from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { EmptyState, ErrorState } from "../components/StateViews";
import { formatPrice } from "../utils/format";

const STATUS_STYLES = {
  pending: "bg-[#fce4ee] text-stone-700",
  processing: "bg-pastel-blue text-stone-700",
  shipped: "bg-pastel-purple text-stone-700",
  delivered: "bg-pastel-teal text-stone-700",
  cancelled: "bg-pastel-pink text-stone-700",
};

function hasValidUserId() {
  const id = getGuestUserId();
  return id && /^[a-f\d]{24}$/i.test(id);
}

export default function OrderHistoryPage() {
  const { data: orders, isLoading, isError, error, refetch } = useOrders();

  // I skip the fetch if the session isn't registered with the API yet
  if (!hasValidUserId()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <EmptyState
          title="Setting up your account…"
          description="Your session is being initialized. Please refresh the page in a moment."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Skeleton className="h-7 w-40" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <EmptyState
          title="No orders yet"
          description="Your past orders will show up here once you check out."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Order history</h1>

      <div className="space-y-3">
        {orders.map((order) => {
          const id = order.id ?? order._id;
          const status = order.status ?? "pending";
          const total = order.total ?? order.totalPrice ?? 0;
          const date = order.createdAt ?? order.date;

          return (
            <Link key={id} to={`/orders/${id}`}>
              <Card className="flex items-center justify-between p-4 hover:shadow-md">
                <div>
                  <p className="font-mono text-sm text-stone-700">#{String(id).slice(-8)}</p>
                  {date && (
                    <p className="text-xs text-stone-400">
                      {new Date(date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    STATUS_STYLES[status] ?? "bg-stone-100 text-stone-700"
                  }`}
                >
                  {status}
                </span>
                <p className="font-semibold text-stone-900">{formatPrice(total)}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
