import { RegisterForm } from "../../components/RegisterForm/RegisterForm";

export const metadata = {
  title: "Sign Up - MyApp",
  description: "Create a new account to get started.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen w-full">
      <div className="w-1/2 hidden lg:block relative">
        <img
          className="w-full max-h-screen object-cover"
          src="/buda.svg"
          alt="imagem de Kojun-Sensei em frente ao altar de buda"
        />
      </div>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
        <div className="flex flex-col max-w-140 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <img src="/zenjuiji.svg" alt="logotipo do templo" />
          <h1 className="text-xl font-light mb-4 mt-6 text-center text-white">
            Crie sua conta
          </h1>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
