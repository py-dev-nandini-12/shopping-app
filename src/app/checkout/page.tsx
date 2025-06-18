"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/order-context-optimized";
import { useAuth } from "@/contexts/auth-context";
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    }

    if (step === 2) {
      if (!formData.cardNumber)
        newErrors.cardNumber = "Card number is required";
      if (!formData.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
      if (!formData.nameOnCard)
        newErrors.nameOnCard = "Name on card is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePayment = async () => {
    if (!validateStep(2)) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Create order record
    if (user) {
      const orderId = await addOrder({
        userId: user.id.toString(),
        items: state.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
        total: state.total,
        status: "pending",
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: {
          type: "credit",
          last4: formData.cardNumber.slice(-4),
        },
      });
      setCompletedOrderId(orderId);
    }

    // Clear cart after successful payment
    dispatch({ type: "CLEAR_CART" });

    setIsProcessing(false);
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center shadow-2xl border-0">
          <CardContent className="p-12">
            <div className="mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase, {formData.firstName}!
            </p>
            {completedOrderId && (
              <p className="text-sm text-gray-600 mb-2">
                Order ID:{" "}
                <span className="font-mono text-indigo-600">
                  {completedOrderId}
                </span>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-8">
              We&apos;ll send a confirmation email to {formData.email} shortly.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
              {completedOrderId && (
                <div className="text-xs text-gray-500">
                  Your order has been saved to your order history.
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Link href="/orders">
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  View Order History
                </Button>
              </Link>
              <Link href="/products">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Add some items to your cart to continue.
            </p>
            <Link href="/products">
              <Button className="w-full">Shop Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8 max-w-2xl mx-auto">
            {[
              { step: 1, title: "Shipping", icon: MapPin },
              { step: 2, title: "Payment", icon: CreditCard },
              { step: 3, title: "Review", icon: CheckCircle },
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                    currentStep >= step ? "text-purple-600" : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
                {step < 3 && (
                  <div
                    className={`ml-8 w-16 h-1 rounded-full transition-colors duration-300 ${
                      currentStep > step
                        ? "bg-gradient-to-r from-purple-600 to-blue-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-1" />
                        First Name*
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address*
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address*
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City*
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State*
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="NY"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code*
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.zipCode ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="10001"
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number*
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.cardNumber ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date*
                      </label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.expiryDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="inline h-4 w-4 mr-1" />
                        CVV*
                      </label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.cvv ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name*
                    </label>
                    <input
                      type="text"
                      value={formData.nameOnCard}
                      onChange={(e) =>
                        handleInputChange("nameOnCard", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.nameOnCard ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.nameOnCard && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nameOnCard}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    Review Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} • Color: {item.color}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 font-semibold"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({state.items.length} items)
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">
                          Free
                        </span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-xl font-bold text-purple-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                      🚚
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
