import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/providers";
import Header from "@/ui/layout/header";
import Footer from "@/ui/layout/footer";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/lib/config/wagmi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thrive",
  description: "Crush your savings goals onchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProvider initialState={initialState}>
          <div className=" max-w-5xl mx-auto">
            <Header />
            <div className="mt-[92px]   w-full">{children}</div>
            <Footer />
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
