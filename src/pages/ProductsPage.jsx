import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import { EmptyState, ErrorState } from "../components/StateViews";
import Pagination from "../components/Pagination";
import Input from "../components/Input";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  // UI State: These variables just control what we see on this specific page.
  // We use 'useState' to remember what the user typed in the search box, what category they picked, and what page they are on.
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // 'useDebouncedValue' is a cool trick! It waits until the user STOPS typing for 400 milliseconds before updating.
  // This prevents us from sending a request to the server for every single letter they type.
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // Fetch the categories from the server using React Query
  const { data: categories } = useCategories();

  // Fetch the products based on our current page, search term, and category.
  const {
    data,
    isLoading, // True if we are loading data for the first time
    isError,   // True if something went wrong (like no internet)
    error,
    isFetching,// True if we are loading data in the background (like changing pages)
    refetch,
  } = useProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    category,
  });

  // When the user types in the search box, we update the state and jump back to page 1.
  function handleSearchChange(value) {
    setSearchInput(value);
    setPage(1);
  }

  // When the user picks a category, we update the state and jump back to page 1.
  function handleCategoryChange(value) {
    setCategory(value);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 transition-colors duration-300">
      
      {/* Top Header Section */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Shop</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Browse the full catalog, search, and filter by category.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="search"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="sm:w-64"
          />
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500 transition-colors"
          >
            <option value="">All categories</option>
            {/* We map over the categories array to create dropdown options */}
            {(categories ?? []).map((c) => (
              <option key={c.id ?? c._id} value={c.id ?? c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Loading State: Show nice skeleton placeholders while waiting */}
      {isLoading && <ProductGridSkeleton count={PAGE_SIZE} />}

      {/* 2. Error State: Show an error message with a retry button */}
      {isError && (
        <ErrorState
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {/* 3. Empty State: Show this if the search worked, but no products matched */}
      {!isLoading && !isError && data?.items?.length === 0 && (
        <EmptyState
          title="No products found"
          description="Try a different search term or clear the category filter."
        />
      )}

      {/* 4. Success State: Show the grid of products! */}
      {!isLoading && !isError && data?.items?.length > 0 && (
        <>
          <div
            // If we are 'fetching' in the background (like changing pages), we make the grid slightly see-through
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${
              isFetching ? "opacity-60 transition-opacity" : ""
            }`}
          >
            {data.items.map((product) => (
              <ProductCard key={product.id ?? product._id} product={product} />
            ))}
          </div>
          
          {/* Pagination Controls at the bottom */}
          <Pagination
            page={data.page ?? page}
            totalPages={data.totalPages ?? 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
