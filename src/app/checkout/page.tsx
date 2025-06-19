import { CheckoutPageClient } from './checkout-client';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutPageClient />
    </AuthGuard>
  );

