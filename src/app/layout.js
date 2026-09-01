import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/ThemeProvider";
import Navbar from "@/components/shered/Navbar";
import { CartProvider } from "@/context/CartContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} font-sans`}>
        <ThemeProvider>
         
          <CartProvider>
             <Navbar />
            {children}
            </CartProvider>{" "}
        </ThemeProvider>
      </body>
    </html>
  );
}
