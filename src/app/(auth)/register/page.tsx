import { RegisterForm } from "@/src/components/RegisterForm/RegisterForm";

export const metadata = {
  title: "Sign Up - MyApp",
  description: "Create a new account to get started.",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-4 mt-6 text-center text-xl font-light text-white">
        Crie sua conta
      </h1>
      <RegisterForm />
    </>
  );
}
