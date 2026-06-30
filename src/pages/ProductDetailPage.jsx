import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useAddToCart } from "../hooks/useCart";
import { useBuyNow } from "../hooks/useOrders";
import Button from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { ErrorState } from "../components/StateViews";
import { formatPrice } from "../utils/format";
import { getProductImage } from "../utils/productImage";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);
  
  const addToCart = useAddToCart();
  const buyNow = useBuyNow();
  
  // I track the chosen quantity and variant locally
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // I show a skeleton while loading
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // I show an error state if the fetch failed
  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  // I show a not-found state if there is no product
  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ErrorState title="Product not found" />
      </div>
    );
  }

  const productId = product.id ?? product._id;
  const variants = product.variants ?? [];
  const price = selectedVariant?.price ?? product.price ?? product.basePrice ?? 0;
  const rating = product.avgRating ?? product.rating ?? null;
  const imgSrc = getProductImage(product);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 transition-colors duration-300">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-brand-600 dark:text-stone-400 dark:hover:text-brand-400 transition-colors">
        <span>←</span> Back to shop
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800 shadow-md">
          <img
            src={imgSrc}
            alt={product.name ?? product.title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format";
            }}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
            {product.name ?? product.title}
          </h1>
          {rating != null && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>★</span> {Number(rating).toFixed(1)} average rating
            </p>
          )}
          <p className="mt-4 text-3xl font-semibold text-stone-900 dark:text-white">
            {formatPrice(price)}
          </p>
          {product.description && (
            <p className="mt-5 text-base leading-relaxed text-stone-600 dark:text-stone-300">
              {product.description}
            </p>
          )}
          {variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">Variant</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id ?? v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariant === v
                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:border-brand-400 dark:text-brand-300 shadow-sm"
                        : "border-stone-300 text-stone-600 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                    }`}
                  >
                    {v.name ?? v.sku ?? "Option"}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center gap-4">
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Quantity</p>
            <div className="flex items-center rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800">
              <button
                className="px-4 py-2 text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-700 rounded-l-lg transition-colors"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-medium text-stone-900 dark:text-white">
                {quantity}
              </span>
              <button
                className="px-4 py-2 text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-700 rounded-r-lg transition-colors"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              isLoading={addToCart.isPending}
              onClick={() =>
                addToCart.mutate({
                  productId,
                  variantId: selectedVariant?.id ?? selectedVariant?._id,
                  quantity,
                })
              }
              className="flex-1 text-lg shadow-brand-500/20"
            >
              Add to cart
            </Button>
            
            <Button
              variant="secondary"
              isLoading={buyNow.isPending}
              onClick={() =>
                buyNow.mutate(
                  { productId, variantId: selectedVariant?.id ?? selectedVariant?._id, quantity },
                  { onSuccess: (order) => navigate(`/orders/${order.id ?? order._id}`) }
                )
              }
              className="flex-1 text-lg"
            >
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
