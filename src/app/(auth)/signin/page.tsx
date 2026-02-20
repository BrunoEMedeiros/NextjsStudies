import { SigninForm } from "@/src/components/SigninForm/SigninForm";

export const metadata = {
  title: "Sign Up - MyApp",
  description: "Create a new account to get started.",
};

export default function SigninPage() {
  return (
    <>
      <h1 className="mb-4 mt-6 text-center text-xl font-light text-earth-yellow">
        Junte-se a Sangha
      </h1>
      <SigninForm />
    </>
  );
}
