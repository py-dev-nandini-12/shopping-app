'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '@/components/auth/auth-modal';
import { UserDropdown } from '@/components/auth/user-dropdown';
import { useState } from 'react';

export const Header = () => {
  const router = useRouter();
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent hover:from-rose-700 hover:to-purple-700 transition-all duration-300">
            ✨ StyleStore
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-rose-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
              All Products
            </Link>
            <Link href="/products?category=mens-clothing" className="text-gray-700 hover:text-rose-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
              Men
            </Link>
            <Link href="/products?category=womens-clothing" className="text-gray-700 hover:text-rose-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
              Women
            </Link>
            <Link href="/products?category=accessories" className="text-gray-700 hover:text-rose-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
              Accessories
            </Link>
            <Link href="/products?category=shoes" className="text-gray-700 hover:text-rose-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
              Shoes
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white placeholder-gray-500 text-gray-900"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors rounded-lg">
                <Heart className="h-6 w-6 text-gray-600 hover:text-red-500 transition-colors" />
                {wishlistState.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                    {wishlistState.items.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Account */}
            {user ? (
              <UserDropdown />
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100 transition-colors rounded-lg"
                onClick={() => setIsAuthModalOpen(true)}
                disabled={isLoading}
              >
                <User className="h-6 w-6 text-gray-600 hover:text-rose-600 transition-colors" />
              </Button>
            )}

            {/* Shopping Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors rounded-lg">
                <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-rose-600 transition-colors" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                    {cartState.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-gray-100 transition-colors rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link 
                  href="/products" 
                  className="block py-3 px-4 text-gray-700 hover:text-indigo-600 transition-colors font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link 
                  href="/products?category=mens-clothing" 
                  className="block py-3 px-4 text-gray-700 hover:text-indigo-600 transition-colors font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Men&apos;s Clothing
                </Link>
                <Link 
                  href="/products?category=womens-clothing" 
                  className="block py-3 px-4 text-gray-700 hover:text-indigo-600 transition-colors font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Women&apos;s Clothing
                </Link>
                <Link 
                  href="/products?category=accessories" 
                  className="block py-3 px-4 text-gray-700 hover:text-indigo-600 transition-colors font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accessories
                </Link>
                <Link 
                  href="/products?category=shoes" 
                  className="block py-3 px-4 text-gray-700 hover:text-indigo-600 transition-colors font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shoes
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
}
