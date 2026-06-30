import { Link } from "react-router-dom";

// My site footer
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white py-8 transition-colors duration-300 dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">

        <div className="flex flex-col items-center sm:items-start">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-white">
            <span className="text-brand-500">●</span> E-Comus
          </Link>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            © {new Date().getFullYear()} E-Comus. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-stone-500 dark:text-stone-400">
          <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400">
            Shop
          </Link>
          <Link to="/orders" className="hover:text-brand-600 dark:hover:text-brand-400">
            Orders
          </Link>
          <a
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-stone-900 dark:hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
