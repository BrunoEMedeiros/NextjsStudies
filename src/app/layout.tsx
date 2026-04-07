import "../globals.css";
import StoreProvider from "@/src/lib/provider/StoreProvider";
import ReactQueryProvider from "../lib/provider/ReactQueryProvider";
import { Geist } from "next/font/google";
import { cn } from "@/src/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body className={`antialiased`}>
        <ReactQueryProvider>
          <StoreProvider>{children}</StoreProvider>
          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
