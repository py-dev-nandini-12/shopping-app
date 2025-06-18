import type { Metadata } from "next";
import { Playfair_Display, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AuthProvider } from "@/contexts/auth-context";
import { OrderProvider } from "@/contexts/order-context-optimized";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "StyleStore - Your Fashion Destination",
  description: "Discover the latest fashion trends with our curated collection of premium clothing, accessories, and footwear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${poppins.variable} antialiased`}
      >
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
              </WishlistProvider>
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
