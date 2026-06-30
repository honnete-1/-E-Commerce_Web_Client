import apiClient from "./client";

export async function fetchProducts({
  page = 1,
  limit = 12,
  search = "",
  category = "",
} = {}) {
  // I use the dedicated endpoint since /products doesn't support ?category=
  if (category) {
    const { data } = await apiClient.get(`/products/category/${category}`, {
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
      },
    });
    const rawItems =
      data?.data?.all ??
      data?.data?.products ??
      data?.data ??
      data?.products ??
      data;
    const items = Array.isArray(rawItems) ? rawItems : [];
    const pagination = data?.pagination ?? {};
    const total = pagination.total ?? items.length;
    const totalPages = pagination.pages ?? Math.max(1, Math.ceil(total / limit));
    return {
      items,
      total,
      page: pagination.page ?? page,
      totalPages,
    };
  }

  // I fall back to the standard paginated product list
  const { data } = await apiClient.get("/products", {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
    },
  });

  const rawItems =
    data?.data?.all ??
    data?.data?.products ??
    data?.data ??
    data?.products ??
    data;
  const items = Array.isArray(rawItems) ? rawItems : [];

  const pagination = data?.pagination ?? {};
  const total = pagination.total ?? items.length;
  const totalPages = pagination.pages ?? Math.max(1, Math.ceil(total / limit));

  return {
    items,
    total,
    page: pagination.page ?? page,
    totalPages,
  };
}

export async function fetchProductById(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  // I check multiple common envelope shapes to avoid crashing on a mismatch
  return data?.data?.product ?? data?.product ?? data?.data ?? data;
}

export async function fetchProductsByCategory(categoryId, params = {}) {
  const { data } = await apiClient.get(`/products/category/${categoryId}`, {
    params,
  });
  const rawItems =
    data?.data?.all ??
    data?.data?.products ??
    data?.data ??
    data?.products ??
    data;
  const items = Array.isArray(rawItems) ? rawItems : [];
  return { items, total: data?.pagination?.total ?? items.length };
}
