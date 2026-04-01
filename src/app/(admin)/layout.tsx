import DashBoardNavBar from "@/src/components/DashboardNavBar/DashboardNavBar";
import { Toaster } from "@/src/components/ui/sonner";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen font-sans">
      <DashBoardNavBar />
      <div className="w-full flex justify-center items-center pt-6">
        {children}
        <Toaster richColors position="top-right" />
      </div>
    </main>
  );
}
