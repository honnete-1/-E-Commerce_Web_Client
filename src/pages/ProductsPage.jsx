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
  // I keep search, category, and page as local UI state
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // I debounce search so I don't fire a request on every keystroke
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const { data: categories } = useCategories();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    category,
  });

  // I reset to page 1 whenever the search term changes
  function handleSearchChange(value) {
    setSearchInput(value);
    setPage(1);
  }

  // I reset to page 1 whenever the category changes
  function handleCategoryChange(value) {
    setCategory(value);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 transition-colors duration-300">

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Shop</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Browse the full catalog, search, and filter by category.
          </p>
        </div>

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
            {(categories ?? []).map((c) => (
              <option key={c.id ?? c._id} value={c.id ?? c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <ProductGridSkeleton count={PAGE_SIZE} />}

      {isError && (
        <ErrorState
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && data?.items?.length === 0 && (
        <EmptyState
          title="No products found"
          description="Try a different search term or clear the category filter."
        />
      )}

      {!isLoading && !isError && data?.items?.length > 0 && (
        <>
          <div
            // I fade the grid while fetching in the background
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${
              isFetching ? "opacity-60 transition-opacity" : ""
            }`}
          >
            {data.items.map((product) => (
              <ProductCard key={product.id ?? product._id} product={product} />
            ))}
          </div>

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
