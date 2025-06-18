import { Hero } from "@/components/layout/hero";
import { ProductGrid } from "@/components/product/product-grid";
import { fetchFeaturedProducts, fetchCategories } from "@/lib/actions";

export default async function Home() {
  // Fetch featured products from API
  const featuredProducts = await fetchFeaturedProducts();
  const categories = await fetchCategories();

  return (
    <div>
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <ProductGrid 
          products={featuredProducts} 
          title="Featured Products" 
        />
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections designed to fit every style and occasion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-gray-200 aspect-square hover:shadow-lg transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                </div>
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
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
