import apiClient from "./client";

// Category names I hide — junk/test entries from the shared API
const HIDDEN_CATEGORIES = new Set(["test", "testcat123"]);

export async function fetchCategories() {
  const { data } = await apiClient.get("/categories");

  const candidate =
    data?.data?.categories ??
    data?.data ??
    data?.categories ??
    data;

  const raw = Array.isArray(candidate) ? candidate : [];

  // I remove junk categories and deduplicate by name
  const seen = new Set();
  const cleaned = raw.filter((cat) => {
    const key = (cat.name ?? "").toLowerCase().trim();
    if (!key) return false;
    if (HIDDEN_CATEGORIES.has(key)) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // I check each category for products in parallel to keep it fast
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

  // I only surface categories that actually have products
  return withCounts
    .filter(({ count }) => count > 0)
    .map(({ cat }) => cat);
}
