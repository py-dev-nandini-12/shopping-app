'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const CartSummary = ({ subtotal, shipping, tax, total }: CartSummaryProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-semibold">Subtotal</span>
          <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-semibold">Shipping</span>
          <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-semibold">Tax</span>
          <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link href="/checkout">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 text-lg">
            Proceed to Checkout
          </Button>
        </Link>
        
        <Link href="/products">
          <Button variant="outline" className="w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300 text-gray-700 hover:text-gray-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md">
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-800 text-center font-medium">
          {shipping === 0 ? (
            "🎉 You qualify for FREE shipping!"
          ) : (
            `Add $${(100 - subtotal).toFixed(2)} more for FREE shipping`
          )}
        </p>
      </div>
    </div>
  );
};
