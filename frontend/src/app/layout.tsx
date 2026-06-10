import type { Metadata } from "next";
import { Cairo} from "next/font/google";
import { cn } from "@/lib/utils";
import './globals.css'
import Header from "./components/Header";


const cairo = Cairo({
  variable: "--font-geist-sans",
  subsets: ["arabic"],
});



export const metadata: Metadata = {
  title: "مركز العميد",
  description: "مركز العميد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn("h-full", "antialiased", cairo.variable , cairo.className)}
    >
      <Header />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
