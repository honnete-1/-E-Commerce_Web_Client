import apiClient from "./client";

// Cart is server-backed (per the brief's "cart contents must survive a
// refresh" requirement) and scoped by the guest userId injected by the
// Axios interceptor. We never mirror cart contents into local state —
// the TanStack Query cache for ["cart"] is the single source of truth.

export async function fetchCart() {
  const { data } = await apiClient.get("/cart");
  return data?.data ?? data;
}

export async function addToCart({ productId, variantId, quantity = 1 }) {
  const { data } = await apiClient.post("/cart/items", {
    productId,
    ...(variantId ? { variantId } : {}),
    quantity,
  });
  return data?.data ?? data;
}

export async function updateCartItem({ itemId, quantity }) {
  const { data } = await apiClient.patch(`/cart/items/${itemId}`, {
    quantity,
  });
  return data?.data ?? data;
}

export async function removeCartItem(itemId) {
  const { data } = await apiClient.delete(`/cart/items/${itemId}`);
  return data?.data ?? data;
}

export async function clearCart() {
  const { data } = await apiClient.delete("/cart");
  return data?.data ?? data;
}
