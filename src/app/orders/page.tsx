'use client'

import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: cartState } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
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
          <p className="text-gray-600">Welcome back, {user?.firstName}! Here are your order details.</p>
        </div>

        {/* Current Cart Items (Demo) */}
        {cartState.items.length > 0 ? (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Cart Items</h2>
            <p className="text-gray-600 mb-4">Items in your cart (not yet ordered):</p>
            <div className="space-y-3">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
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
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-indigo-600">${cartState.total.toFixed(2)}</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Cart Status</h2>
            <p className="text-green-700 mb-2">Your cart is currently empty.</p>
            <p className="text-sm text-gray-600">
              If you just completed an order, your cart has been successfully cleared. 
              In a real app, your completed orders would appear in the order history below.
            </p>
          </div>
        )}

        {/* Demo Orders Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
          
          {/* Demo Message */}
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              This is a demo app. In a real application, your order history would appear here.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your cart and wishlist data is now being saved per user account and will persist when you log back in!
            </p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
