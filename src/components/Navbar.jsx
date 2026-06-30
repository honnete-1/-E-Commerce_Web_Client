import { Link, NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useTheme } from "../hooks/useTheme";

// I color the active nav link differently from inactive ones
const navLinkClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive 
      ? "text-brand-600 dark:text-brand-400"
      : "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
  }`;

export default function Navbar() {
  const { data: cart } = useCart();
  const { isDark, toggleTheme } = useTheme();

  // I sum item quantities for the cart badge
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-pastel-blue/30 via-white to-pastel-lilac/30 dark:from-stone-900/80 dark:via-stone-900/80 dark:to-stone-900/80 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-white">
          <span className="text-brand-500 animate-pulse">●</span> E-Comus
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <NavLink to="/" className={navLinkClasses} end>
            Shop
          </NavLink>
          <NavLink to="/orders" className={navLinkClasses}>
            Orders
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
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
