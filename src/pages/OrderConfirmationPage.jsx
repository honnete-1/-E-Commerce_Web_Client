import { Link, useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import Button from "../components/Button";
import Card from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { ErrorState } from "../components/StateViews";
import { formatPrice } from "../utils/format";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <ErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  const total = order?.total ?? order?.totalPrice ?? 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 text-center">
      <div className="text-5xl">🎉</div>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Order placed!</h1>
      <p className="mt-2 text-sm text-stone-500">
        Thanks for your order. We'll get it on its way soon.
      </p>

      <Card className="mt-6 p-5 text-left">
        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>Order ID</span>
          <span className="font-mono text-stone-800">{order?.id ?? order?._id ?? id}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-stone-600">
          <span>Status</span>
          <span className="font-medium text-stone-800">{order?.status ?? "pending"}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-2 text-base font-semibold text-stone-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </Card>

      <div className="mt-6 flex justify-center gap-3">
        <Link to="/orders">
          <Button variant="secondary">View order history</Button>
        </Link>
        <Link to="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
