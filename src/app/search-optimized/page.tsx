"use client";

import React, { useState, useDeferredValue, use, Suspense } from "react";
import { Search, Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

// Async function for searching products
async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=12`);
    const data = await response.json();
    
    return data.products.map((product: {
      id: number;
      title: string;
      description: string;
      price: number;
      thumbnail: string;
      images: string[];
      category: string;
      rating: number;
      stock: number;
    }) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.price * 1.2, // Simulate original price
      thumbnail: product.thumbnail,
      images: product.images,
      category: product.category,
      rating: product.rating,
      stock: product.stock,
      inStock: product.stock > 0,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy', 'Gray'],
      isNew: Math.random() > 0.7,
      isTrending: Math.random() > 0.8,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Component that uses React 19's use() hook for async data
function SearchResults({ searchPromise }: { searchPromise: Promise<Product[]> }) {
  const products = use(searchPromise);

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No products found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Loading component
function SearchLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
      <span className="ml-2 text-gray-600">Searching...</span>
    </div>
  );
}

export default function OptimizedSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPromise, setSearchPromise] = useState<Promise<Product[]> | null>(null);
  
  // React 19 useDeferredValue for better performance
  const deferredQuery = useDeferredValue(searchQuery);

  // Update search promise when deferred query changes
  React.useEffect(() => {
    if (deferredQuery.trim()) {
      setSearchPromise(searchProducts(deferredQuery));
    } else {
      setSearchPromise(null);
    }
  }, [deferredQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchPromise(searchProducts(searchQuery));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            Search Products
          </h1>
          <p className="text-gray-600 text-lg">
            Discover amazing products with React 19 optimized search
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-24 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results with React 19 Suspense and use() */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-0">
          {searchPromise ? (
            <Suspense fallback={<SearchLoading />}>
              <SearchResults searchPromise={searchPromise} />
            </Suspense>
          ) : (
            <div className="text-center py-12">
              <Search className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Ready to search?
              </h3>
              <p className="text-gray-500">
                Enter a search term above to find amazing products
              </p>
            </div>
          )}
        </div>

        {/* Search Tips */}
        <div className="mt-8 bg-gradient-to-r from-rose-100 to-purple-100 rounded-xl p-6 border border-rose-200">
          <h3 className="text-lg font-semibold text-rose-800 mb-3">Search Tips:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-rose-700">
            <div>
              <strong>Popular searches:</strong>
              <br />
              Phone, Laptop, Watch, Shoes
            </div>
            <div>
              <strong>Categories:</strong>
              <br />
              Electronics, Fashion, Home, Beauty
            </div>
            <div>
              <strong>Features:</strong>
              <br />
              React 19 optimized with use() hook
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
