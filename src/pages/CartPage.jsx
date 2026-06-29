import { Link, useNavigate } from "react-router-dom";
import { useCart, useRemoveCartItem, useUpdateCartItem, useClearCart } from "../hooks/useCart";
import Button from "../components/Button";
import Card from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { EmptyState, ErrorState } from "../components/StateViews";
import { formatPrice } from "../utils/format";

export default function CartPage() {
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Skeleton className="h-7 w-40" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
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

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <EmptyState
          title="Your cart is empty"
          description="Browse the shop and add something you like."
          action={
            <Link to="/">
              <Button size="sm" className="mt-2">Browse products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Your Cart</h1>
        <button
          onClick={() => clearCart.mutate()}
          className="text-sm text-stone-500 hover:text-red-600"
        >
          Clear cart
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const itemId = item.id ?? item._id;
          const name = item.name ?? item.product?.name ?? item.product?.title ?? "Item";
          const image = item.image ?? item.product?.images?.[0]?.url;
          const price = item.price ?? item.product?.price ?? 0;

          return (
            <Card key={itemId} className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {image ? (
                  <img src={image} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl text-stone-300">
                    🛍️
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-stone-800">{name}</p>
                <p className="text-sm text-stone-500">{formatPrice(price)}</p>
              </div>

              <div className="flex items-center rounded-lg border border-stone-300">
                <button
                  className="px-2.5 py-1 text-stone-600 hover:bg-stone-50"
                  onClick={() =>
                    updateItem.mutate({
                      itemId,
                      quantity: Math.max(1, (item.quantity ?? 1) - 1),
                    })
                  }
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity ?? 1}</span>
                <button
                  className="px-2.5 py-1 text-stone-600 hover:bg-stone-50"
                  onClick={() =>
                    updateItem.mutate({ itemId, quantity: (item.quantity ?? 1) + 1 })
                  }
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right text-sm font-semibold text-stone-900">
                {formatPrice(price * (item.quantity ?? 1))}
              </p>

              <button
                onClick={() => removeItem.mutate(itemId)}
                className="text-stone-400 hover:text-red-600"
                aria-label="Remove item"
              >
                ✕
              </button>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 flex items-center justify-between p-4">
        <span className="text-sm font-medium text-stone-600">Subtotal</span>
        <span className="text-xl font-bold text-stone-900">{formatPrice(subtotal)}</span>
      </Card>

      <Button className="mt-4 w-full" onClick={() => navigate("/checkout")}>
        Proceed to checkout
      </Button>
    </div>
  );
}
