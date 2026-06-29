import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart";
import toast from "react-hot-toast";

const CART_KEY = ["cart"];

// The cart is server state end to end: it is read with useQuery and
// every mutation invalidates (or optimistically patches) that same
// query key. No cart data is ever copied into useState.
export function useCart() {
  return useQuery({
    queryKey: CART_KEY,
    queryFn: fetchCart,
  });
}

function useCartMutation(mutationFn, { successMessage, errorMessage }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      if (successMessage) toast.success(successMessage);
    },
    onError: (error) => {
      toast.error(error?.message || errorMessage);
    },
  });
}

export function useAddToCart() {
  return useCartMutation(addToCart, {
    successMessage: "Added to cart",
    errorMessage: "Couldn't add this item to your cart. Please try again.",
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartItem,
    // Optimistic update: the quantity stepper should feel instant.
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previousCart = queryClient.getQueryData(CART_KEY);

      queryClient.setQueryData(CART_KEY, (old) => {
        if (!old) return old;
        const items = (old.items ?? []).map((item) =>
          item.id === itemId || item._id === itemId
            ? { ...item, quantity }
            : item
        );
        return { ...old, items };
      });

      return { previousCart };
    },
    onError: (error, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_KEY, context.previousCart);
      }
      toast.error(error?.message || "Couldn't update quantity. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previousCart = queryClient.getQueryData(CART_KEY);

      queryClient.setQueryData(CART_KEY, (old) => {
        if (!old) return old;
        const items = (old.items ?? []).filter(
          (item) => item.id !== itemId && item._id !== itemId
        );
        return { ...old, items };
      });

      return { previousCart };
    },
    onSuccess: () => toast.success("Removed from cart"),
    onError: (error, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_KEY, context.previousCart);
      }
      toast.error(error?.message || "Couldn't remove item. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useClearCart() {
  return useCartMutation(clearCart, {
    errorMessage: "Couldn't clear your cart. Please try again.",
  });
}
