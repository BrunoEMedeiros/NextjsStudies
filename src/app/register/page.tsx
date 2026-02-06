import { RegisterForm } from "../../components/RegisterForm/RegisterForm";

export const metadata = {
  title: "Sign Up - MyApp",
  description: "Create a new account to get started.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Crie sua conta</h1>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <RegisterForm />
          <div className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
