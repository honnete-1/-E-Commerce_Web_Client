import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buyNow, fetchOrderById, fetchOrders, placeOrderFromCart } from "../api/orders";
import { getGuestUserId } from "../utils/guestUser";
import toast from "react-hot-toast";

function hasValidUserId() {
  const id = getGuestUserId();
  return id && /^[a-f\d]{24}$/i.test(id);
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    // Don't even attempt the fetch if we don't have a valid MongoDB userId.
    // This prevents the Malformed ObjectID crash on the orders page.
    enabled: hasValidUserId(),
    retry: false,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchOrderById(id),
    enabled: Boolean(id) && hasValidUserId(),
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeOrderFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Checkout failed, please try again.");
    },
  });
}

export function useBuyNow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buyNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Purchase failed, please try again.");
    },
  });
}
