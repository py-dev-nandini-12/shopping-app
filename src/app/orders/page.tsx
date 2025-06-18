"use client";

import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/order-context-optimized";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: cartState } = useCart();
  const { state: orderState } = useOrders();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Here are your order details.
          </p>
        </div>

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
              {cartState.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} • ${item.product.price}
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • Color: ${item.color}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  ${cartState.total.toFixed(2)}
                </span>
              </div>
              <div className="mt-4">
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✅ Cart Status
            </h2>
            <p className="text-green-700 mb-2">Your cart is currently empty.</p>
            <p className="text-sm text-gray-600">
              If you just completed an order, your cart has been successfully
              cleared. In a real app, your completed orders would appear in the
              order history below.
            </p>
          </div>
        )}

        {/* Order History Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order History
          </h2>

          {orderState.orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven&apos;t placed any orders yet. Start shopping to see
                your order history here!
              </p>
              <Link
                href="/products"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orderState.orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Order #{order.id.split("_")[1]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={`${item.id}-${item.size || ""}-${
                          item.color || ""
                        }`}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-indigo-600 text-xs font-medium">
                              {item.product.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.product.name}
                          </h4>
                          <div className="text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span> • Size: {item.size}</span>}
                            {item.color && <span> • Color: {item.color}</span>}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            ${item.product.price.toFixed(2)} each
                          </p>
                          <p className="font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Information */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">
                          Shipping Address
                        </h5>
                        <p className="text-gray-600">
                          {order.shippingAddress?.firstName}{" "}
                          {order.shippingAddress?.lastName}
                          <br />
                          {order.shippingAddress?.address}
                          <br />
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}{" "}
                          {order.shippingAddress?.zipCode}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">
                          Payment Method
                        </h5>
                        <p className="text-gray-600">
                          {"type" in order.paymentMethod
                            ? (order.paymentMethod.type === "credit"
                                ? "Credit"
                                : "Debit") +
                              (order.paymentMethod.last4
                                ? ` Card ending in ${order.paymentMethod.last4}`
                                : " Card")
                            : "Card"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
