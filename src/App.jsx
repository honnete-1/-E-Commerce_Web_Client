import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailPage from "./pages/OrderDetailPage";

// One QueryClient for the whole app. Sensible shared defaults; each
// hook overrides staleTime where it matters (categories vs. live cart).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-stone-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/orders/:id/confirmation" element={<OrderConfirmationPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route
                path="*"
                element={
                  <div className="mx-auto max-w-xl px-4 py-16 text-center text-stone-500">
                    Page not found.
                  </div>
                }
              />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </BrowserRouter>
    </QueryClientProvider>
  );
}
