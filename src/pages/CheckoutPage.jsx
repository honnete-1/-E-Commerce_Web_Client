import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { usePlaceOrder } from "../hooks/useOrders";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { Skeleton } from "../components/Skeleton";
import { EmptyState } from "../components/StateViews";
import { formatPrice } from "../utils/format";

export default function CheckoutPage() {
  const { data: cart, isLoading } = useCart();
  const placeOrder = usePlaceOrder();
  const navigate = useNavigate();

  // I keep shipping form fields as local UI state
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-6 h-64 w-full rounded-xl" />
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before checking out."
        />
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1),
    0
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.phone) {
      setFormError("Please fill in all shipping details.");
      return;
    }
    setFormError("");

    placeOrder.mutate(
      { shipping },
      {
        onSuccess: (order) => {
          navigate(`/orders/${order.id ?? order._id}/confirmation`);
        },
      }
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-stone-700">Shipping details</h2>
          <Input
            id="fullName"
            label="Full name"
            value={shipping.fullName}
            onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
            required
          />
          <Input
            id="address"
            label="Address"
            value={shipping.address}
            onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="city"
              label="City"
              value={shipping.city}
              onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
              required
            />
            <Input
              id="phone"
              label="Phone"
              value={shipping.phone}
              onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
              required
            />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
        </Card>

        <Card className="flex items-center justify-between p-4">
          <span className="text-sm font-medium text-stone-600">Total</span>
          <span className="text-xl font-bold text-stone-900">{formatPrice(subtotal)}</span>
        </Card>

        <Button type="submit" className="w-full" isLoading={placeOrder.isPending}>
          Place order
        </Button>
      </form>
    </div>
  );
}
