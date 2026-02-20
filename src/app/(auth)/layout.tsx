import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full">
      <div className="hidden w-1/2 relative lg:block">
        <Image
          src="/buda.svg"
          alt="Imagem da estatua de buda em frente a entrada do templo"
          fill
          className="object-cover"
          priority={false}
          sizes="50vw"
        />
      </div>
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
        <div className="max-w-140 flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <img src="/zenjuiji.svg" alt="logotipo do templo" />
          {children}
        </div>
      </div>
    </main>
  );
}
