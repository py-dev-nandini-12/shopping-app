'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/cart-context";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="p-6 border-b border-gray-200 last:border-b-0">
      <div className="flex gap-6">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                {item.product.name}
              </h3>
              <p className="text-sm text-blue-600 font-medium mt-1">
                {item.product.brand}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            {item.size && (
              <span className="text-sm text-gray-600">
                Size: <span className="font-medium">{item.size}</span>
              </span>
            )}
            {item.color && (
              <span className="text-sm text-gray-600">
                Color: <span className="font-medium">{item.color}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
              {item.quantity > 1 && (
                <p className="text-sm text-gray-600">
                  ${item.product.price.toFixed(2)} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
