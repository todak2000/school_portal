import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "@/components/layout/Wrapper";
import ProviderWrapper from "@/components/layout/ProviderWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akwa Ibom State Schools Portal",
  description: `Arise: Secure, Efficient, Data-Driven Planning for the future of our
          Children&apos;s Education.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProviderWrapper>
          <Wrapper>{children}</Wrapper>
        </ProviderWrapper>
      </body>
    </html>
  );
}
