"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loginUser, registerUser } from "@/app/actions";

// User type
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  token?: string;
}

// Auth state type
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth actions
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "LOAD_USER"; payload: User | null };

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Auth context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch({ type: "LOAD_USER", payload: user });
        } else {
          dispatch({ type: "LOAD_USER", payload: null });
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        dispatch({ type: "LOAD_USER", payload: null });
      }
    };

    loadUser();

    // Listen for storage events to sync auth state
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const result = await loginUser(username, password);

      if (result.user) {
        const user: User = {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          image: result.user.image,
          token: result.user.token,
        };

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", result.user.token);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return { success: true };
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        return { success: false, error: result.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // Register function
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const result = await registerUser(
        firstName,
        lastName,
        email,
        username,
        password
      );

      if (result.user) {
        const user: User = {
          id: result.user.id!,
          username: result.user.username!,
          email: result.user.email!,
          firstName: result.user.firstName!,
          lastName: result.user.lastName!,
          image: result.user.image,
          token: result.user.token,
        };

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        if (result.user.token) {
          localStorage.setItem("token", result.user.token);
        }

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return { success: true };
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        return { success: false, error: result.error || "Registration failed" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // Logout function
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear user-specific data (cart, wishlist, orders) by setting empty states
    if (state.user) {
      // Clear user-specific cart and wishlist
      localStorage.removeItem(`cart_${state.user.id}`);
      localStorage.removeItem(`wishlist_${state.user.id}`);
      localStorage.removeItem(`orders_${state.user.id}`);
    }

    // Also clear guest data to ensure clean state
    localStorage.removeItem("cart_guest");
    localStorage.removeItem("wishlist_guest");
    localStorage.removeItem("orders_guest");

    dispatch({ type: "LOGOUT" });

    // Trigger a custom event to force contexts to reload
    console.log("Dispatching userLogout event");
    window.dispatchEvent(new Event("userLogout"));
  };

  const value = {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
