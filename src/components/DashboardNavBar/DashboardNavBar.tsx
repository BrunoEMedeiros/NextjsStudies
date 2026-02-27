"use client";

import Image from "next/image";
import { PiFlowerLotusThin } from "react-icons/pi";
import NavBarItems from "../NavBarItems/NavBaritems";
import { useDashBoardNavBar } from "./useDashboardNavBar";

export default function DashBoardNavBar() {
  const { handleSignOut, name, role, profile_picture } = useDashBoardNavBar();
  return (
    <nav className="w-1/6 min-w-50 bg-gray-900 text-white pt-8 sticky top-0 h-screen border-r border-gray-800">
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
      <div className="flex flex-col justify-center items-center">
        <h2>{name}</h2>
        <h2>{role}</h2>
        {profile_picture ? (
          <Image
            src={profile_picture}
            alt="imagem de perfil do usuário"
            width={60}
            height={60}
            className="border-2 rounded-full"
          />
        ) : (
          <div className="flex w-full justify-center items-center p-4">
            <PiFlowerLotusThin color="#dbad6c" size={30} />
          </div>
        )}
      </div>
      <NavBarItems
        items={[
          { label: "Atividades", href: "/dashboard/activities" },
          { label: "Membros", href: "/dashboard/members" },
          { label: "Relatórios", href: "/dashboard/reports" },
          { label: "Sair", href: "/signin", onClick: handleSignOut },
        ]}
      />
    </nav>
  );
}
