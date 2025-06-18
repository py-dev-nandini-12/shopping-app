import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-200/30 via-pink-200/40 to-purple-200/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,113,133,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.3),transparent_70%)]"></div>
        
        {/* Animated particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-rose-300/50 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-pink-300/60 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-ping delay-2000"></div>
        <div className="absolute top-60 right-20 w-1 h-1 bg-rose-400/60 rounded-full animate-pulse delay-500"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-200/30 to-pink-200/30 backdrop-blur-xl border border-rose-300/40 rounded-full px-6 py-3 mb-8 shadow-2xl">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="text-sm font-semibold text-rose-800 tracking-wide font-heading">✨ New Collection Available</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight font-display">
            <span className="text-gray-800 block mb-2">Fashion That</span>
            <span className="block bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse italic">
              Defines You
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-16 text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
            Discover premium clothing, accessories, and footwear that reflect your unique style. 
            <span className="font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent font-heading"> Quality meets elegance.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 group border-0 rounded-xl">
                Shop Collection
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/products?featured=true">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-cyan-400/60 text-gray-800 hover:bg-cyan-100/50 backdrop-blur-xl px-10 py-4 text-lg font-bold transition-all duration-300 rounded-xl shadow-xl"
              >
                Featured Items
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-cyan-200/40 to-teal-200/40 backdrop-blur-xl rounded-2xl border border-cyan-300/30 shadow-xl">
              <div className="text-4xl font-bold text-gray-800 mb-2">10K+</div>
              <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-teal-200/40 to-emerald-200/40 backdrop-blur-xl rounded-2xl border border-teal-300/30 shadow-xl">
              <div className="text-4xl font-bold text-gray-800 mb-2">500+</div>
              <div className="text-sm text-gray-600 font-medium">Premium Products</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-200/40 to-green-200/40 backdrop-blur-xl rounded-2xl border border-emerald-300/30 shadow-xl">
              <div className="text-4xl font-bold text-gray-800 mb-2">50+</div>
              <div className="text-sm text-gray-600 font-medium">Top Brands</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-16 left-8 w-40 h-40 bg-gradient-to-r from-cyan-300/30 to-teal-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-56 h-56 bg-gradient-to-r from-teal-300/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-r from-emerald-300/20 to-green-300/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-r from-emerald-400/25 to-teal-500/25 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
    </section>
  );
}
