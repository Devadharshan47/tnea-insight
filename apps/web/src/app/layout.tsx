import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TNEA Insight - Tamil Nadu Engineering College Portal",
  description: "AI-Powered partner for TNEA admissions. Explore colleges, predict cutoffs, fill choices, and secure your future in Tamil Nadu engineering universities.",
  keywords: ["TNEA", "Tamil Nadu Engineering", "Engineering Admissions", "Anna University", "Cutoff Predictor"],
  authors: [{ name: "TNEA Insight Team" }],
  openGraph: {
    title: "TNEA Insight - Engineering Admissions Portal",
    description: "Your trusted, AI-powered partner for TNEA admissions and college selection.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased min-h-screen bg-background text-on-surface font-sans`}
      >
        <AuthContextProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
