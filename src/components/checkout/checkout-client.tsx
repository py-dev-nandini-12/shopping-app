"use client";

import React, {
  useState,
  useActionState,
  useOptimistic,
  startTransition,
  useEffect,
  useRef,
} from "react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/contexts/order-context-optimized";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  CheckCircle,
  Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  validateShippingAction,
  validatePaymentAction,
} from "./checkout-actions";

export function CheckoutClient() {
  const { optimisticState: cartState, clearCartOptimistic } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const orderProcessedRef = useRef(false);

  // React 19 useActionState for shipping validation
  const [shippingState, shippingAction, isShippingPending] = useActionState(
    validateShippingAction,
    {
      success: false,
      step: 1,
    }
  );

  // React 19 useActionState for payment validation
  const [paymentState, paymentAction, isPaymentPending] = useActionState(
    validatePaymentAction,
    {
      success: false,
      step: 2,
    }
  );

  // React 19 useOptimistic for order completion
  const [orderComplete, setOrderComplete] = useOptimistic(
    false,
    (current, newValue: boolean) => newValue
  );

  // Card number and expiry date formatting helpers
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatCardNumber(e.target.value);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatExpiryDate(e.target.value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").substring(0, 4);
    e.target.value = value;
  };

  // Handle successful shipping validation
  React.useEffect(() => {
    if (shippingState.success && shippingState.step === 2) {
      setCurrentStep(2);
    }
  }, [shippingState.success, shippingState.step]);

  // Handle successful payment and order completion
  useEffect(() => {
    if (paymentState.success && paymentState.orderId && user && !orderProcessedRef.current) {
      // Mark as processed to prevent multiple executions
      orderProcessedRef.current = true;
      
      // Immediately set order complete and step 3 to prevent UI flickering
      startTransition(() => {
        setOrderComplete(true);
      });
      setCurrentStep(3);

      // Create order using the order context
      const orderData = {
        userId: user.id?.toString() || "",
        items: cartState.items,
        total: cartState.total,
        status: "processing" as const,
        shippingAddress: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
        },
        paymentMethod: {
          cardNumber: "**** **** **** ****",
          expiryDate: "",
          nameOnCard: "",
        },
      };

      // Add order through context and clear cart
      addOrder(orderData).then(() => {
        // Clear cart after order is saved
        clearCartOptimistic();
      }).catch((error) => {
        console.error("Error creating order:", error);
        // Reset if there's an error
        orderProcessedRef.current = false;
        setCurrentStep(2);
        startTransition(() => {
          setOrderComplete(false);
        });
      });
    }
  }, [paymentState, user, addOrder, clearCartOptimistic, setOrderComplete, cartState.items, cartState.total]);

  // Reset order processed flag when starting checkout process
  useEffect(() => {
    if (currentStep === 1) {
      orderProcessedRef.current = false;
    }
  }, [currentStep]);

  // Show empty cart only if cart is empty AND order is not complete AND we're not on completion step
  if (cartState.items.length === 0 && !orderComplete && currentStep < 3 && !orderProcessedRef.current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add some items to your cart before checking out.
              </p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-8 py-3">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, label: "Shipping", icon: MapPin },
              { step: 2, label: "Payment", icon: CreditCard },
              { step: 3, label: "Complete", icon: CheckCircle },
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-rose-500 to-purple-500 border-rose-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step ? "text-rose-600" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`grid gap-8 ${(currentStep === 3 || orderComplete) ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Main Content */}
          <div className={(currentStep === 3 || orderComplete) ? 'w-full max-w-2xl mx-auto' : 'lg:col-span-2'}>
            {currentStep === 1 && (
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={shippingAction} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          defaultValue={user?.firstName || ""}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                          required
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          defaultValue={user?.lastName || ""}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        defaultValue={user?.email || ""}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                    </div>

                    {shippingState.error && (
                      <div className="text-red-800 text-sm bg-red-50 p-3 rounded-lg border border-red-200 font-bold">
                        {shippingState.error}
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <Link href="/cart">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300 text-gray-700 hover:text-gray-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Cart
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        disabled={isShippingPending}
                        className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-8"
                      >
                        {isShippingPending
                          ? "Validating..."
                          : "Continue to Payment"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                    <CreditCard className="h-5 w-5 text-rose-500" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={paymentAction} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                      <input
                        type="text"
                        name="nameOnCard"
                        placeholder="Name on Card"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                    </div>

                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        onChange={handleCardNumberChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        maxLength={5}
                        onChange={handleExpiryDateChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                        required
                      />
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          maxLength={4}
                          onChange={handleCvvChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-black placeholder-gray-700 font-semibold"
                          required
                        />
                      </div>
                    </div>

                    {paymentState.error && (
                      <div className="text-red-800 text-sm bg-red-50 p-3 rounded-lg border border-red-200 font-bold">
                        {paymentState.error}
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300 text-gray-700 hover:text-gray-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shipping
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPaymentPending}
                        className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-8"
                      >
                        {isPaymentPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          `Pay $${cartState.total.toFixed(2)}`
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {(currentStep === 3 || orderComplete) && (
              <Card className="bg-white shadow-xl border-0">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Order Confirmed!
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Thank you for your purchase.
                  </p>
                  {paymentState.orderId && (
                    <p className="text-sm text-gray-500 mb-8">
                      Order ID:{" "}
                      <span className="font-mono font-semibold">
                        {paymentState.orderId}
                      </span>
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/orders">
                      <Button className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white">
                        View Orders
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button
                        variant="outline"
                        className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300 text-gray-700 hover:text-gray-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary - Only show when not completed */}
          {currentStep !== 3 && !orderComplete && (
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-xl border-0 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-black">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-black truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-black font-bold">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-black text-black">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-black font-bold">Subtotal:</span>
                        <span className="font-black text-black">
                          ${cartState.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-black font-bold">Shipping:</span>
                        <span className="font-black text-green-700">Free</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-black font-bold">Tax:</span>
                        <span className="font-black text-black">
                          ${(cartState.total * 0.08).toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t mt-2 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-black text-black">
                            Total:
                          </span>
                          <span className="text-xl font-black bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                            ${(cartState.total * 1.08).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
