import apiClient from "./client";

export async function placeOrderFromCart(payload = {}) {
  const { data } = await apiClient.post("/orders", payload);
  return data?.data ?? data;
}

export async function buyNow({ productId, variantId, quantity = 1, ...rest }) {
  const { data } = await apiClient.post("/orders/buy", {
    productId,
    ...(variantId ? { variantId } : {}),
    quantity,
    ...rest,
  });
  return data?.data ?? data;
}

export async function fetchOrders() {
  const { data } = await apiClient.get("/orders");
  const candidate = data?.data?.orders ?? data?.data ?? data?.orders ?? data;
  return Array.isArray(candidate) ? candidate : [];
}

export async function fetchOrderById(id) {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data?.data ?? data;
}
