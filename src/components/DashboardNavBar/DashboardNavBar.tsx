"use client";

import Image from "next/image";

export default function DashBoardNavBar() {
  return (
    <nav className="w-1/6 bg-gray-900 text-white py-8 sticky top-0 h-screen border-r border-gray-800">
      <div className="flex justify-center items-center h-20">
        <Image
          src="/LogoZenrp.svg"
          width={75}
          height={75}
          alt="Logotipo da comunidade zen budista de Ribeirão Preto"
          priority={true}
          unoptimized
        />
      </div>
      <ul className="flex flex-col justify-around">
        <li className="flex p-4 justify-center items-center hover:bg-earth-yellow hover:text-rich_black text-base text-light-coral font-light hover:cursor-pointer">
          Atividades
        </li>
        <li className="flex p-4 justify-center items-center hover:bg-earth-yellow hover:text-rich_black text-base text-light-coral font-light hover:cursor-pointer">
          Membros
        </li>
        <li className="flex p-4 justify-center items-center hover:bg-earth-yellow hover:text-rich_black text-base text-light-coral font-light hover:cursor-pointer ">
          Recados
        </li>
        <li className="flex p-4 justify-center items-center hover:bg-earth-yellow hover:text-rich_black text-base text-light-coral font-light hover:cursor-pointer">
          Relatórios
        </li>
      </ul>
    </nav>
  );
}
