import DashBoardNavBar from "@/src/components/DashboardNavBar/DashboardNavBar";

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
      </div>
    </main>
  );
}
