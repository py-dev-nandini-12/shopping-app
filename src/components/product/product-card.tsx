'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishlistDispatch, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    setIsAddingToCart(true);
    
    cartDispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0]
      }
    });
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { id: product.id } });
    } else {
      wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  return (
    <div 
      className="group relative bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-700 overflow-hidden border border-cyan-200/60 hover:border-teal-300/70 transform hover:-translate-y-3 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 via-teal-200/20 to-emerald-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-cyan-100/50 to-teal-100/50 rounded-t-3xl">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
              -{discountPercentage}% OFF
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 shadow-xl backdrop-blur-sm ${
            isInWishlist(product.id)
              ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-white transform scale-110'
              : 'bg-white/90 text-gray-600 hover:bg-cyan-50 hover:text-cyan-500 hover:scale-110'
          }`}
        >
          <Heart 
            className={`h-5 w-5 transition-all duration-300 ${
              isInWishlist(product.id) ? 'fill-current' : ''
            }`} 
          />
        </button>

        {/* Quick View Button */}
        <div className={`absolute top-4 right-20 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <Link href={`/products/${product.id}`}>
            <button className="p-3 bg-white/90 text-gray-600 rounded-full hover:bg-cyan-50 hover:text-cyan-600 transition-all duration-300 shadow-xl backdrop-blur-sm hover:scale-110">
              <Eye className="h-5 w-5" />
            </button>
          </Link>
        </div>

        {/* Add to Cart Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cyan-900/90 via-teal-900/50 to-transparent transition-all duration-500 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <Button 
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className={`w-full font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 border-0 text-lg ${
              isAddingToCart 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600 text-white hover:shadow-cyan-500/50'
            }`}
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Added to Cart!
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4 bg-gradient-to-br from-white/80 to-cyan-50/60">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-cyan-600 uppercase tracking-wider">
            {product.brand}
          </p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <span className="text-sm font-semibold text-gray-700">
              {product.rating}
            </span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 hover:text-cyan-600 transition-colors line-clamp-2 leading-snug text-lg">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-amber-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-gray-800">
            ${product.price}
          </span>
          {product.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-500 line-through font-medium">
                ${product.originalPrice}
              </span>
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Available Options */}
        <div className="flex items-center justify-between pt-3 border-t border-cyan-200/50">
          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-cyan-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    style={{ 
                      backgroundColor: color.toLowerCase().includes('white') ? '#ffffff' :
                                     color.toLowerCase().includes('black') ? '#000000' :
                                     color.toLowerCase().includes('blue') ? '#3b82f6' :
                                     color.toLowerCase().includes('red') ? '#ef4444' :
                                     color.toLowerCase().includes('gray') ? '#6b7280' :
                                     color.toLowerCase().includes('brown') ? '#92400e' :
                                     color.toLowerCase().includes('green') ? '#10b981' :
                                     color.toLowerCase().includes('pink') ? '#ec4899' :
                                     color.toLowerCase().includes('purple') ? '#8b5cf6' :
                                     '#9ca3af'
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-500 font-medium">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="text-right">
            {product.inStock ? (
              <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                {product.stockCount > 10 ? 'In Stock' : `Only ${product.stockCount} left`}
              </span>
            ) : (
              <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
