"use client";

import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/order-context-optimized";
import { useActionState, useEffect, useState } from "react";
import {
  cancelOrderAction,
  reorderAction,
  type OrderActionState,
} from "./orders-actions";
import Link from "next/link";
import Image from "next/image";

// Helper function to calculate remaining time for processing orders
const calculateRemainingTime = (createdAt: Date): number => {
  const now = new Date();
  const timeDiff = now.getTime() - createdAt.getTime();
  const thirtySecondsInMs = 30 * 1000; // 30 seconds
  const remaining = thirtySecondsInMs - timeDiff;
  return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds remaining
};

// Processing countdown component
function ProcessingCountdown({ order }: { order: { createdAt: Date; status: string } }) {
  const [remainingTime, setRemainingTime] = useState(() =>
    calculateRemainingTime(order.createdAt)
  );

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      const newTime = calculateRemainingTime(order.createdAt);
      setRemainingTime(newTime);

      if (newTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt, remainingTime]);

  if (remainingTime <= 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 my-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <p className="text-sm text-yellow-800">
          <span className="font-medium">Processing order...</span>{" "}
          <span className="ml-2">Will be delivered in {remainingTime}s</span>
        </p>
      </div>
    </div>
  );
}

export function OrdersClient() {
  const { user, isAuthenticated } = useAuth();
  const { state: cartState, addToCartOptimistic } = useCart();
  const { optimisticState: orderState, cancelOrder } = useOrders();

  // React 19 useActionState for server actions
  const [cancelState, cancelAction, isCancelPending] = useActionState<
    OrderActionState,
    FormData
  >(cancelOrderAction, { success: false });

  const [reorderState, reorderActionHandler, isReorderPending] = useActionState<
    OrderActionState,
    FormData
  >(reorderAction, { success: false });

  // Handle successful order cancellation
  useEffect(() => {
    if (cancelState.success && cancelState.message) {
      // Extract order ID from the message
      const orderIdMatch = cancelState.message.match(
        /Order (\S+) has been cancelled/
      );
      if (orderIdMatch) {
        const orderId = orderIdMatch[1];
        cancelOrder(orderId);
      }
    }
  }, [cancelState, cancelOrder]);

  const handleCancelOrder = (orderId: string) => {
    const formData = new FormData();
    formData.append("orderId", orderId);
    cancelAction(formData);
  };

  const handleReorder = (orderId: string) => {
    // Find the order and add its items to cart immediately
    const order = orderState.orders.find((o) => o.id === orderId);
    if (order && order.items) {
      order.items.forEach((item) => {
        addToCartOptimistic(item.product, item.quantity);
      });

      // Also trigger the server action for any server-side processing
      const formData = new FormData();
      formData.append("orderId", orderId);
      reorderActionHandler(formData);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Please Sign In
        </h1>
        <p className="text-gray-600 mb-8">
          You need to be signed in to view your orders.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  // Filter out cancelled orders and filter by current user
  const userOrders = orderState.orders.filter(
    (order) => order.userId === user?.id?.toString()
  );
  const activeOrders = userOrders.filter(
    (order) =>
      order.status !== "cancelled" &&
      order.items &&
      order.items.length > 0 &&
      order.total > 0
  );

  if (orderState.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading your orders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Here are your order details.
          </p>
        </div>
        {/* Action Feedback */}
        {cancelState.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{cancelState.error}</p>
          </div>
        )}
        {cancelState.success && cancelState.message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{cancelState.message}</p>
          </div>
        )}
        {reorderState.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{reorderState.error}</p>
          </div>
        )}
        {reorderState.success && reorderState.message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{reorderState.message}</p>
          </div>
        )}
        {/* Current Cart Items (Demo) */}
        {cartState.items.length > 0 ? (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Cart Items
            </h2>
            <p className="text-gray-600 mb-4">
              Items in your cart (not yet ordered):
            </p>
            <div className="space-y-3">
              {cartState.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {cartState.items.length > 3 && (
                <p className="text-sm text-gray-500">
                  ...and {cartState.items.length - 3} more items
                </p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total: ${cartState.total.toFixed(2)}
                </span>
                <Link
                  href="/checkout"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200 text-center">
            <p className="text-gray-600">Your cart is currently empty.</p>
            <Link
              href="/products"
              className="inline-block mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Start Shopping
            </Link>
          </div>
        )}
        {/* Orders List */}
        <div className="space-y-6">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Placed on{" "}
                        {order.createdAt?.toLocaleDateString() ||
                          "Unknown date"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === "processing" 
                          ? "🔄 Processing" 
                          : order.status === "delivered"
                          ? "✅ Delivered"
                          : order.status.charAt(0).toUpperCase() + order.status.slice(1)
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × $
                            {item.product.price.toFixed(2)}
                          </p>
                          {item.size && (
                            <p className="text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500 pl-20">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  {/* Processing countdown timer */}
                  {order.status === "processing" && (
                    <ProcessingCountdown order={order} />
                  )}

                  {/* Status-based help text */}
                  {order.status === "processing" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">You can still cancel</span> this order while it&apos;s being processed.
                      </p>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 my-3">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Order delivered!</span> You can reorder these items or view order details.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleReorder(order.id)}
                      disabled={isReorderPending}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      {isReorderPending ? "Adding to Cart..." : "Reorder"}
                    </button>
                    {order.status === "processing" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={isCancelPending}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        {isCancelPending ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-all duration-300 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven&apos;t placed any orders yet. Start shopping to see
                your orders here!
              </p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
