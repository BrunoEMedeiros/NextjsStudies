import { RegisterForm } from "../../components/RegisterForm/RegisterForm";

export const metadata = {
  title: "Sign Up - MyApp",
  description: "Create a new account to get started.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-earth-yellow">
          Crie sua conta
        </h1>
        <RegisterForm />
      </div>
    </main>
  );
}
