import { Link, NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useTheme } from "../hooks/useTheme";

// This function figures out what color our navigation links should be.
// 'isActive' is provided by React Router to tell us if we are currently on that page.
const navLinkClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive 
      ? "text-brand-600 dark:text-brand-400" // The color when we ARE on the page (brighter in dark mode)
      : "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white" // The color when we are NOT on the page
  }`;

export default function Navbar() {
  // We use our custom hooks here to get the cart data and the dark mode tools!
  const { data: cart } = useCart();
  const { isDark, toggleTheme } = useTheme();
  
  // We add up all the quantities in the cart to show a little badge number.
  // The '??' means "if it's undefined or null, use 0 instead".
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;

  return (
    // 'sticky top-0' makes the navbar stay at the top when we scroll down.
    // 'backdrop-blur' makes the background slightly see-through and blurry (glassmorphism!)
    <header className="sticky top-0 z-30 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-pastel-blue/30 via-white to-pastel-lilac/30 dark:from-stone-900/80 dark:via-stone-900/80 dark:to-stone-900/80 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        
        {/* The Logo Section */}
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-white">
          <span className="text-brand-500 animate-pulse">●</span> E-Comus
        </Link>

        {/* The Navigation Links (Hidden on very small screens, visible on 'sm' screens and up) */}
        <nav className="hidden items-center gap-6 sm:flex">
          <NavLink to="/" className={navLinkClasses} end>
            Shop
          </NavLink>
          <NavLink to="/orders" className={navLinkClasses}>
            Orders
          </NavLink>
        </nav>

        {/* The Right Side Controls (Dark Mode Toggle & Cart) */}
        <div className="flex items-center gap-4">
          
          {/* Our New Dark Mode Toggle Button! */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-700"
            aria-label="Toggle dark mode"
          >
            {isDark ? "🌙" : "☀️"}
          </button>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-lg border border-stone-300 dark:border-stone-700 px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            🛒 Cart
            
            {/* The little notification badge for cart items. We only show it if there's something in the cart! */}
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-pastel-pink dark:bg-brand-500 px-1 text-xs font-semibold text-stone-800 dark:text-white animate-bounce shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
