import "../globals.css";
import StoreProvider from "@/src/lib/provider/StoreProvider";
import ReactQueryProvider from "../lib/provider/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased`}>
        <ReactQueryProvider>
          <StoreProvider>{children}</StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
