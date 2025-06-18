"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Sparkles,
  Code,
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Optimistic Cart Updates",
    description: "Instant UI feedback with useOptimistic hook for cart operations",
    path: "/products",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: CreditCard,
    title: "Server Actions Checkout",
    description: "React 19 useActionState for seamless checkout flow",
    path: "/checkout-optimized",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Search,
    title: "Async Search with use()",
    description: "React 19 use() hook for async data fetching in search",
    path: "/search-optimized",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Sparkles,
    title: "Deferred Values",
    description: "useDeferredValue for better search performance",
    path: "/search-optimized",
    color: "from-orange-500 to-red-500"
  }
];

const hookExamples = [
  {
    hook: "useOptimistic",
    description: "Immediate UI updates for cart operations",
    example: "addToCartOptimistic(product)",
    status: "✅ Implemented"
  },
  {
    hook: "useActionState",
    description: "Server actions for forms and checkout",
    example: "useActionState(loginAction, initialState)",
    status: "✅ Implemented"
  },
  {
    hook: "use()",
    description: "Async data fetching in components",
    example: "const data = use(searchPromise)",
    status: "✅ Implemented"
  },
  {
    hook: "useDeferredValue",
    description: "Defer non-urgent state updates",
    example: "const deferred = useDeferredValue(query)",
    status: "✅ Implemented"
  },
  {
    hook: "startTransition",
    description: "Mark updates as non-urgent",
    example: "startTransition(() => setState(...))",
    status: "✅ Implemented"
  }
];

export default function React19Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              React 19 E-Commerce
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of React with all the latest hooks and features integrated into a modern e-commerce platform
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <Link href={feature.path}>
                  <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white group-hover:shadow-lg transition-all duration-300">
                    Try it out
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* React 19 Hooks Overview */}
        <Card className="mb-12 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Code className="h-6 w-6 text-purple-600" />
              React 19 Hooks Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hookExamples.map((hook, index) => (
                <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-purple-50 border border-purple-100">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-purple-800 text-lg">{hook.hook}</h3>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {hook.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{hook.description}</p>
                  <code className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono">
                    {hook.example}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Benefits */}
        <Card className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-emerald-800">
              <Zap className="h-6 w-6" />
              Performance Optimizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-emerald-800 mb-2">Instant Cart Updates</h3>
                <p className="text-emerald-600 text-sm">
                  useOptimistic provides immediate feedback for all cart operations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-cyan-800 mb-2">Smooth Search</h3>
                <p className="text-cyan-600 text-sm">
                  useDeferredValue prevents UI blocking during search
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Form Handling</h3>
                <p className="text-purple-600 text-sm">
                  useActionState simplifies server-side form processing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore the Platform</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button variant="outline" className="bg-white hover:bg-rose-50 border-rose-200">
                Browse Products
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="bg-white hover:bg-purple-50 border-purple-200">
                View Cart
              </Button>
            </Link>
            <Link href="/checkout-optimized">
              <Button variant="outline" className="bg-white hover:bg-cyan-50 border-cyan-200">
                Try Checkout
              </Button>
            </Link>
            <Link href="/search-optimized">
              <Button variant="outline" className="bg-white hover:bg-emerald-50 border-emerald-200">
                Search Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
