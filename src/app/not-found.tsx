import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center font-bold mt-9 ">
        404... Pagina não encontrada
      </h1>
      <p>A página que esta tentando acessar não existe</p>
      <Link href={"/"}>Voltar para o inicio</Link>
    </div>
  );
}
