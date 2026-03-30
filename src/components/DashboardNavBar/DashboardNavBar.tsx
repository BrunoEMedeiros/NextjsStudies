"use client";

import Image from "next/image";
import { PiFlowerLotusThin } from "react-icons/pi";
import NavBarItems from "../NavBarItems/NavBaritems";
import { useDashBoardNavBar } from "./useDashboardNavBar";
import RoleBadge from "../RoleBedge/RoleBadge";

export default function DashBoardNavBar() {
  const { handleSignOut, name, role, profilePicture } = useDashBoardNavBar();
  return (
    <nav className="w-1/6 min-w-50 bg-rich-black text-white pt-8 sticky top-0 h-screen border-r border-gray-800">
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
      <div className="flex flex-col justify-center items-center gap-4 mb-6">
        <p className="text-base font-thin">{name}</p>
        {profilePicture ? (
          <Image
            unoptimized={true}
            src={profilePicture}
            alt="imagem de perfil do usuário"
            width={100}
            height={100}
            className="border-2 rounded-full"
          />
        ) : (
          <div className="flex w-full justify-center items-center p-4">
            <PiFlowerLotusThin color="#dbad6c" size={30} />
          </div>
        )}
        <RoleBadge type={role!} />
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
