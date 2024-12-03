import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Issuer Demo",
  description: "Demo Verifiable credential issuer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-muted flex flex-col">
          <div className="flex flex-col bg-background w-full max-w-5xl mx-auto lg:my-8 lg:border border-border lg:drop-shadow-sm flex-grow">
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
