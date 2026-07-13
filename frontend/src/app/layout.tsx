"use client";
import { useRouter } from "next/navigation";
import { Cairo } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Header from "./components/Header";
import ClientProviders from "@/context/ClientProvider";
import Toolbar from "./components/Toolbar";

const cairo = Cairo({
  variable: "--font-geist-sans",
  subsets: ["arabic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();


  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn("h-full", "antialiased", cairo.variable, cairo.className)}
    >
      <body className="min-h-full flex flex-col">
        <ClientProviders>
          <Toolbar
            onAction={async (action) => {
              switch (action) {
                case "home":
                  router.push("/");
                  break;

                case "products":
                  router.push("/products");
                  break;

                case "new-product":
                  router.push("/products/new");
                  break;

                case "new-sale":
                  router.push("/sales/new");
                  break;

                case "backup":
                  await window.api.backup.create();
                  break;
                case "reports":
                  router.push("/report");
                  break;

                case "print":
                  window.api.invoice.print();
                  break;

                case "refresh":
                  router.refresh();
                  break;
                case "export-excel":
                  await window.api.products.export();
                  break;
                case "restore":
                  await window.api.backup.restore();
                  break;
              }
            }}
          />
          <Header />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
