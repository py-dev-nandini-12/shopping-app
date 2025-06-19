"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { CartItem, CartSummary, EmptyCart } from "@/components/cart";

export default function CartPage() {
  const {
    optimisticState: cartState,
    updateQuantityOptimistic,
    removeFromCartOptimistic,
    clearCartOptimistic,
  } = useCart();

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantityOptimistic(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCartOptimistic(id);
  };

  const handleClearCart = () => {
    clearCartOptimistic();
  };

  const subtotal = cartState.total;
  const shipping = subtotal > 100 ? 0 : 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartState.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
        <Button
          variant="outline"
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {cartState.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
