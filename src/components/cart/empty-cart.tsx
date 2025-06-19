import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
        <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Add some amazing products to your cart to continue shopping.
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
