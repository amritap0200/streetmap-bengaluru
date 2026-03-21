import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreetMap Bengaluru",
  description: "Discover and share hidden gems in Bengaluru with StreetMap - your go-to map for cafes, parks, metro stations, BMTC stops, and restaurants. Explore the city like never before and contribute your favorite spots to the community!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
