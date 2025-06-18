"use client";

import React, {
  useActionState,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Info,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { loginAction, registerAction } from "@/app/auth-actions";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  // React 19 useActionState for login
  const [loginState, loginFormAction, isLoginPending] = useActionState(
    loginAction,
    {
      success: false,
    }
  );

  // React 19 useActionState for register
  const [registerState, registerFormAction, isRegisterPending] = useActionState(
    registerAction,
    {
      success: false,
    }
  );

  // React 19 useOptimistic for UI feedback
  const [optimisticAuth, setOptimisticAuth] = useOptimistic(
    { isAuthenticated: false },
    (state, newAuth: boolean) => ({ isAuthenticated: newAuth })
  );

  const currentState = mode === "login" ? loginState : registerState;
  const isPending = mode === "login" ? isLoginPending : isRegisterPending;

  // Handle successful authentication
  React.useEffect(() => {
    if (currentState.success && currentState.user) {
      // Update optimistic state inside startTransition
      startTransition(() => {
        setOptimisticAuth(true);
      });

      // Store user data
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(currentState.user));
        localStorage.setItem("token", currentState.user.token || "");
      }

      // Update auth context
      login(currentState.user, currentState.user.password);

      // Close modal
      onClose();
    }
  }, [
    currentState.success,
    currentState.user,
    login,
    onClose,
    setOptimisticAuth,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full flex items-center justify-center min-h-full py-8">
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-2xl mx-4">
          <CardHeader className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              {mode === "login" ? "Welcome Back!" : "Create Account"}
            </CardTitle>
            <p className="text-gray-600">
              {mode === "login"
                ? "Sign in to your account to continue shopping"
                : "Join us and start your fashion journey"}
            </p>
          </CardHeader>

          <CardContent>
            {mode === "login" && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-rose-100 rounded-full p-1">
                    <Info className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-rose-800 mb-2">
                      Test Accounts
                    </h4>
                    <div className="text-xs text-rose-700 space-y-1">
                      <div>
                        <strong>Username:</strong> emilys{" "}
                        <strong>Password:</strong> emilyspass
                      </div>
                      <div>
                        <strong>Username:</strong> michaelw{" "}
                        <strong>Password:</strong> michaelwpass
                      </div>
                      <div>
                        <strong>Username:</strong> sophiab{" "}
                        <strong>Password:</strong> sophiabpass
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* React 19 Form with Server Actions */}
            <form
              action={mode === "login" ? loginFormAction : registerFormAction}
              className="space-y-4"
            >
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={mode === "login" ? "text" : "email"}
                  name={mode === "login" ? "username" : "email"}
                  placeholder={mode === "login" ? "Username" : "Email Address"}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {currentState.error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {currentState.error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending || optimisticAuth.isAuthenticated}
                className="w-full bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-rose-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {mode === "login" ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : optimisticAuth.isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Success!
                  </div>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
