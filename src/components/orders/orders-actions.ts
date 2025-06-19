"use server";

import { revalidatePath } from "next/cache";

export interface OrderActionState {
  success: boolean;
  error?: string;
  message?: string;
}

export async function cancelOrderAction(
  _prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  try {
    const orderId = formData.get("orderId") as string;

    if (!orderId) {
      return {
        success: false,
        error: "Invalid order ID",
      };
    }

    // Simulate server processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, you'd update the order status in the database
    
    revalidatePath("/orders");
    
    return {
      success: true,
      message: `Order ${orderId} has been cancelled`,
    };
  } catch {
    return {
      success: false,
      error: "Failed to cancel order",
    };
  }
}

export async function reorderAction(
  _prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  try {
    const orderId = formData.get("orderId") as string;

    if (!orderId) {
      return {
        success: false,
        error: "Invalid order ID",
      };
    }

    // Simulate server processing
    await new Promise(resolve => setTimeout(resolve, 300));

    // In a real app, you'd add the order items back to cart
    
    revalidatePath("/orders");
    revalidatePath("/cart");
    
    return {
      success: true,
      message: "Items added to cart successfully",
    };
  } catch {
    return {
      success: false,
      error: "Failed to reorder",
    };
  }
}
