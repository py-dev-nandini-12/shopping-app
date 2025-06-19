"use server";

import { revalidatePath } from "next/cache";

export interface CartActionState {
  success: boolean;
  error?: string;
  message?: string;
}

export async function updateCartQuantityAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  try {
    const itemId = formData.get("itemId") as string;
    const quantity = parseInt(formData.get("quantity") as string);

    if (!itemId || isNaN(quantity) || quantity < 0) {
      return {
        success: false,
        error: "Invalid item ID or quantity",
      };
    }

    // Simulate server processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    // In a real app, you'd update the database here
    // For now, we'll let the client handle the optimistic update

    revalidatePath("/cart");

    return {
      success: true,
      message: `Quantity updated to ${quantity}`,
    };
  } catch {
    return {
      success: false,
      error: "Failed to update quantity",
    };
  }
}

export async function removeCartItemAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  try {
    const itemId = formData.get("itemId") as string;

    if (!itemId) {
      return {
        success: false,
        error: "Invalid item ID",
      };
    }

    // Simulate server processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    revalidatePath("/cart");

    return {
      success: true,
      message: "Item removed from cart",
    };
  } catch {
    return {
      success: false,
      error: "Failed to remove item",
    };
  }
}

export async function clearCartAction(): Promise<CartActionState> {
  try {
    // Simulate server processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart cleared successfully",
    };
  } catch {
    return {
      success: false,
      error: "Failed to clear cart",
    };
  }
}
