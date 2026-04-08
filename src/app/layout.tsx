import "../globals.css";
import StoreProvider from "@/src/lib/provider/StoreProvider";
import ReactQueryProvider from "../lib/provider/ReactQueryProvider";
import { Inter } from "next/font/google";
import { cn } from "@/src/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // ← new CSS variable name
  weight: ["300", "400", "700"], // optional: specify needed weights
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn(inter.variable)}>
      <body className="antialiased font-sans">
        <ReactQueryProvider>
          <StoreProvider>{children}</StoreProvider>
          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
