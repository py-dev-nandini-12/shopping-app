'use client'

import { useWishlist } from '@/contexts/wishlist-context';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { ProductCard } from '@/components/product/product-card';
import Link from 'next/link';

export default function WishlistPage() {
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-8">You need to be signed in to view your wishlist.</p>
        <Link 
          href="/"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  const handleRemoveFromWishlist = (productId: string) => {
    wishlistDispatch({
      type: 'REMOVE_FROM_WISHLIST',
      payload: { id: productId }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
        <p className="text-gray-600 text-lg">
          {wishlistState.items.length > 0 
            ? `You have ${wishlistState.items.length} item${wishlistState.items.length > 1 ? 's' : ''} in your wishlist.`
            : 'Your wishlist is empty.'
          }
        </p>
      </div>

      {wishlistState.items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">💔</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start adding products to your wishlist by clicking the heart icon on products you love!
          </p>
          <Link
            href="/products"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Wishlist Actions */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => wishlistDispatch({ type: 'CLEAR_WISHLIST' })}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear Wishlist
              </button>
              <button
                onClick={() => {
                  wishlistState.items.forEach(product => {
                    cartDispatch({
                      type: 'ADD_TO_CART',
                      payload: { product, quantity: 1 }
                    });
                  });
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
              >
                Add All to Cart
              </button>
            </div>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistState.items.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                
                {/* Wishlist-specific actions */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
