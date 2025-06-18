import { ProductGrid } from "@/components/product/product-grid";
import { fetchProducts, fetchProductsByCategory, searchProducts } from "@/app/actions";
import { Suspense } from "react";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-xl aspect-square animate-pulse"></div>
      ))}
    </div>
  );
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  // Await searchParams before using its properties
  const params = await searchParams;
  
  // Fetch products based on search params
  let products;
  if (params.search) {
    products = await searchProducts(params.search);
  } else if (params.category) {
    products = await fetchProductsByCategory(params.category);
  } else {
    products = await fetchProducts();
  }

  const categoryNames: Record<string, string> = {
    'mens-clothing': "Men's Clothing",
    'womens-clothing': "Women's Clothing",
    'accessories': 'Accessories',
    'shoes': 'Shoes'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {params.search 
            ? `Search Results for "${params.search}"`
            : params.category 
              ? categoryNames[params.category] || 'Products'
              : 'All Products'
          }
        </h1>
        <p className="text-gray-600 text-lg">
          {params.search 
            ? `Found ${products.length} products matching your search.`
            : 'Discover our complete collection of premium fashion items.'
          }
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-700 mb-4">Category</h4>
              <div className="space-y-3">
                {[
                  { label: 'All Products', value: '', count: '100+' },
                  { label: 'Men\'s Clothing', value: 'mens-clothing', count: '25+' },
                  { label: 'Women\'s Clothing', value: 'womens-clothing', count: '30+' },
                  { label: 'Accessories', value: 'accessories', count: '40+' },
                  { label: 'Shoes', value: 'shoes', count: '15+' }
                ].map((category) => (
                  <a
                    key={category.value}
                    href={category.value ? `/products?category=${category.value}` : '/products'}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      params.category === category.value || (!params.category && !category.value)
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="font-medium">{category.label}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-700 mb-4">Price Range</h4>
              <div className="space-y-3">
                {[
                  { label: 'Under $50', count: '20+' },
                  { label: '$50 - $100', count: '35+' },
                  { label: '$100 - $200', count: '25+' },
                  { label: 'Over $200', count: '15+' }
                ].map((range) => (
                  <label key={range.label} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <span className="text-gray-700">{range.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{range.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4">Popular Brands</h4>
              <div className="space-y-3">
                {['Apple', 'Samsung', 'Nike', 'Adidas', 'HP', 'Dell'].map((brand) => (
                  <label key={brand} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-gray-600 font-medium">
              Showing <span className="font-bold text-gray-900">{products.length}</span> products
            </p>
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Best Rated</option>
              <option>Most Popular</option>
            </select>
          </div>

          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductsContent {...props} />
    </Suspense>
  );
}
