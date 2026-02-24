import { RegisterForm } from "@/src/components/RegisterForm/RegisterForm";

export const metadata = {
  title: "Dashboard",
  description: "Controlls and monitoring of the system",
};

export default function DashboardPage() {
  return (
    <>
      <h1 className="flex-1 justify-center items-center text-2xl text-earth-yellow bg-background">
        Bem vindo
      </h1>
    </>
  );
}
