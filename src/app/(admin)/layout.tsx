import DashBoardNavBar from "@/src/components/DashboardNavBar/DashboardNavBar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen bg-background font-sans">
      <DashBoardNavBar />
      <div>{children}</div>
    </main>
  );
}
