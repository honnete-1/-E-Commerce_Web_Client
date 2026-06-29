import { useQuery } from "@tanstack/react-query";
import {
  fetchProductById,
  fetchProducts,
  fetchProductsByCategory,
} from "../api/products";

// Deliberate, descriptive query key includes every input that affects
// the result, so TanStack Query caches and refetches correctly per
// page/search/category combination.
export function useProducts({ page, limit, search, category }) {
  return useQuery({
    queryKey: ["products", { page, limit, search, category }],
    queryFn: () => fetchProducts({ page, limit, search, category }),
    placeholderData: (previousData) => previousData, // keep old page visible while next page loads
    staleTime: 30_000,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });
}

export function useProductsByCategory(categoryId, params) {
  return useQuery({
    queryKey: ["products", "category", categoryId, params],
    queryFn: () => fetchProductsByCategory(categoryId, params),
    enabled: Boolean(categoryId),
  });
}
