import { AuthGuard } from "@/components/auth/auth-guard";
import { CheckoutPageClient } from "./checkout-client";

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutPageClient />
    </AuthGuard>
  );
}
