import { AuthGuard } from "@/components/auth/auth-guard";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutClient />
    </AuthGuard>
  );
}
