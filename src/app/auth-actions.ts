"use server";

import { loginUser, registerUser } from "./actions";

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

interface AuthState {
  success: boolean;
  error?: string;
  user?: LoginResponse | Partial<LoginResponse>;
}

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return {
      success: false,
      error: "Username and password are required",
    };
  }

  try {
    const result = await loginUser(username, password);
    
    if (result.user) {
      return {
        success: true,
        user: result.user,
      };
    } else {
      return {
        success: false,
        error: result.error || "Invalid credentials. Try these test accounts:\n• emilys / emilyspass\n• michaelw / michaelwpass\n• sophiab / sophiabpass",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

export async function registerAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !username || !password) {
    return {
      success: false,
      error: "All fields are required",
    };
  }

  try {
    const result = await registerUser(firstName, lastName, email, username, password);
    
    if (result.user) {
      return {
        success: true,
        user: result.user,
      };
    } else {
      return {
        success: false,
        error: result.error || "Registration failed. Please try again.",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}
