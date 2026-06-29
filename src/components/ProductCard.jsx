import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Card from "./Card";
import { formatPrice } from "../utils/format";
import { useAddToCart } from "../hooks/useCart";
import { getProductImage } from "../utils/productImage";

/**
 * ProductCard shows a preview of a single product in a grid.
 * We use it on the main shop page.
 */
export default function ProductCard({ product }) {
  // 'useAddToCart' is our custom hook that talks to the server to add items to the cart
  const addToCart = useAddToCart();
  
  // Products usually have an 'id', but some databases use '_id'. We check both!
  const id = product.id ?? product._id;
  
  // We use our cool new utility to guarantee a beautiful, stable image
  const primary = getProductImage(product);
  
  // We store the image source in state just in case we need to change it on error
  const [imgSrc, setImgSrc] = useState(primary);
  
  // Price formatting
  const price = product.price ?? product.basePrice ?? 0;

  return (
    // We wrap everything in our reusable Card component
    // We added 'group' here so we can do cool hover effects on child elements!
    <Card className="flex flex-col p-3 transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-stone-900/50 group">
      
      {/* The Link tag makes the whole image and title clickable to go to the detail page */}
      <Link to={`/products/${id}`} className="block">
        
        {/* The image container. 'aspect-square' makes it a perfect square! */}
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800">
          <img
            src={imgSrc}
            alt={product.name ?? product.title}
            // 'group-hover:scale-105' makes the image zoom in slightly when we hover anywhere on the card! Micro-animations!
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            // If the image fails to load, we fall back to a random Unsplash image
            onError={() => setImgSrc("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format")}
          />
        </div>
        
        {/* The Product Name */}
        <h3 className="mt-3 line-clamp-2 text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {product.name ?? product.title}
        </h3>
      </Link>
      
      {/* The Price */}
      <p className="mt-1 text-base font-semibold text-stone-900 dark:text-white">
        {formatPrice(price)}
      </p>
      
      {/* The Add to Cart Button */}
      <Button
        size="sm"
        className="mt-3 w-full opacity-90 group-hover:opacity-100 transition-opacity"
        isLoading={addToCart.isPending} // Shows a spinner if we are waiting for the server
        onClick={() => addToCart.mutate({ productId: id, quantity: 1 })}
      >
        Add to cart
      </Button>
    </Card>
  );
}
