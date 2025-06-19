import { AuthGuard } from "@/components/auth/auth-guard";
import { CheckoutOptimizedClient } from "./checkout-optimized-client";

export default function CheckoutOptimizedPage() {
  return (
    <AuthGuard>
      <CheckoutOptimizedClient />
    </AuthGuard>
  );
}
