import apiClient from "./client";

// Category names to hide — junk/test entries that exist in the shared
// API but serve no purpose in the storefront UI.
const HIDDEN_CATEGORIES = new Set(["test", "testcat123"]);

export async function fetchCategories() {
  const { data } = await apiClient.get("/categories");

  const candidate =
    data?.data?.categories ??
    data?.data ??
    data?.categories ??
    data;

  const raw = Array.isArray(candidate) ? candidate : [];

  // Remove junk categories and deduplicate by name (case-insensitive).
  const seen = new Set();
  const cleaned = raw.filter((cat) => {
    const key = (cat.name ?? "").toLowerCase().trim();
    if (!key) return false;
    if (HIDDEN_CATEGORIES.has(key)) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // For each remaining category, check if it actually has products.
  // We do these checks in parallel to keep it fast.
  const withCounts = await Promise.all(
    cleaned.map(async (cat) => {
      const id = cat._id ?? cat.id;
      try {
        const { data: pd } = await apiClient.get(`/products/category/${id}`, {
          params: { limit: 1, page: 1 },
        });
        const items =
          pd?.data?.all ??
          pd?.data?.products ??
          pd?.data ??
          pd?.products ??
          [];
        const count = pd?.pagination?.total ?? (Array.isArray(items) ? items.length : 0);
        return { cat, count };
      } catch {
        return { cat, count: 0 };
      }
    })
  );

  // Only surface categories that actually have products.
  return withCounts
    .filter(({ count }) => count > 0)
    .map(({ cat }) => cat);
}
