import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import Card from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { ErrorState } from "../components/StateViews";
import { formatPrice } from "../utils/format";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <ErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  const items = order?.items ?? [];
  const total = order?.total ?? order?.totalPrice ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900">
        Order #{String(order?.id ?? order?._id ?? id).slice(-8)}
      </h1>
      <p className="mt-1 text-sm capitalize text-stone-500">Status: {order?.status ?? "pending"}</p>

      <Card className="mt-6 divide-y divide-stone-200">
        {items.map((item, i) => (
          <div key={item.id ?? i} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-stone-800">
                {item.name ?? item.product?.name ?? "Item"}
              </p>
              <p className="text-xs text-stone-500">Qty {item.quantity ?? 1}</p>
            </div>
            <p className="text-sm font-semibold text-stone-900">
              {formatPrice((item.price ?? 0) * (item.quantity ?? 1))}
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 text-base font-bold text-stone-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </Card>
    </div>
  );
}
