'use client'

import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-8">You need to be signed in to view your profile.</p>
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
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-indigo-100 text-lg">{user?.email}</p>
              <p className="text-indigo-200 text-sm">@{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🛒</div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">{cartState.itemCount}</div>
            <div className="text-gray-600">Items in Cart</div>
            <div className="text-sm text-gray-500 mt-1">${cartState.total.toFixed(2)} total</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-pink-600 mb-1">{wishlistState.items.length}</div>
            <div className="text-gray-600">Wishlist Items</div>
            <div className="text-sm text-gray-500 mt-1">Saved favorites</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-green-600 mb-1">0</div>
            <div className="text-gray-600">Orders</div>
            <div className="text-sm text-gray-500 mt-1">Demo app</div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.firstName}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.lastName}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.email}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.username}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/cart"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div className="font-medium text-gray-900 group-hover:text-indigo-600">View Cart</div>
              <div className="text-sm text-gray-500">{cartState.itemCount} items</div>
            </Link>
            
            <Link
              href="/wishlist"
              className="p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="text-2xl mb-2">❤️</div>
              <div className="font-medium text-gray-900 group-hover:text-pink-600">Wishlist</div>
              <div className="text-sm text-gray-500">{wishlistState.items.length} items</div>
            </Link>
            
            <Link
              href="/orders"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="font-medium text-gray-900 group-hover:text-green-600">My Orders</div>
              <div className="text-sm text-gray-500">Order history</div>
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
