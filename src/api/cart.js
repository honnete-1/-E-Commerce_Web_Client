import apiClient from "./client";

// Cart is server-backed and scoped by the guest userId from the Axios interceptor

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
