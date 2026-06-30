import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Card from "./Card";
import { formatPrice } from "../utils/format";
import { useAddToCart } from "../hooks/useCart";
import { getProductImage } from "../utils/productImage";

// ProductCard shows a single product preview in the shop grid
export default function ProductCard({ product }) {
  const addToCart = useAddToCart();

  // I check both 'id' and '_id' since the API isn't consistent
  const id = product.id ?? product._id;

  const primary = getProductImage(product);

  // I keep the image source in state to swap it on error
  const [imgSrc, setImgSrc] = useState(primary);

  const price = product.price ?? product.basePrice ?? 0;

  return (
    <Card className="flex flex-col p-3 transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-stone-900/50 group">
      <Link to={`/products/${id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800">
          <img
            src={imgSrc}
            alt={product.name ?? product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format")}
          />
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {product.name ?? product.title}
        </h3>
      </Link>

      <p className="mt-1 text-base font-semibold text-stone-900 dark:text-white">
        {formatPrice(price)}
      </p>

      <Button
        size="sm"
        className="mt-3 w-full opacity-90 group-hover:opacity-100 transition-opacity"
        isLoading={addToCart.isPending}
        onClick={() => addToCart.mutate({ productId: id, quantity: 1 })}
      >
        Add to cart
      </Button>
    </Card>
  );
}
