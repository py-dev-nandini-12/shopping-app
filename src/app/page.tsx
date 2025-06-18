import { Hero } from "@/components/layout/hero";
import { ProductGrid } from "@/components/product/product-grid";
import { fetchFeaturedProducts, fetchCategories } from "@/app/actions";

export default async function Home() {
  // Fetch featured products from API
  const featuredProducts = await fetchFeaturedProducts();
  const categories = await fetchCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      <Hero />
      
      <section className="container mx-auto px-4 py-20 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/40 via-transparent to-teal-100/40 rounded-3xl"></div>
        <div className="relative">
          <ProductGrid 
            products={featuredProducts} 
            title="Featured Products" 
          />
        </div>
      </section>

      <section className="bg-gradient-to-br from-teal-100/60 via-cyan-100/40 to-emerald-100/60 py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-cyan-300/30 to-teal-300/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-teal-300/30 to-emerald-300/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-xl font-medium">
              Discover our carefully curated collections designed to fit every style and occasion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 to-cyan-100/60 aspect-square hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-cyan-200/60"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-800/80 via-teal-800/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-teal-300/10 to-emerald-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-cyan-200 transition-colors">
                    {category.name}
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-cyan-200/80 to-teal-200/80 flex items-center justify-center text-2xl font-bold text-gray-700 group-hover:text-gray-800 transition-colors">
                  {category.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
