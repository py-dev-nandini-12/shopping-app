import { AuthGuard } from "@/components/auth/auth-guard";
import { CheckoutClient } from "./checkout-client";

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutClient />
    </AuthGuard>
  );
}
