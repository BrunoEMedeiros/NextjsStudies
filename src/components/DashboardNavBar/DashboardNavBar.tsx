"use client";

import Image from "next/image";
import { useState } from "react";
import { PiFlowerLotusThin } from "react-icons/pi";
import { FaBars, FaTimes } from "react-icons/fa";
import NavBarItems from "../NavBarItems/NavBaritems";
import { useDashBoardNavBar } from "./useDashboardNavBar";
import RoleBadge from "../RoleBadge/RoleBadge";
import { DashBoardNavBarSkeleton } from "./DashBoardNavBarSkeleton";

export default function DashBoardNavBar() {
  const { handleSignOut, name, role, profilePicture, isLoading } =
    useDashBoardNavBar();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return <DashBoardNavBarSkeleton />;

  const content = (
    <div>
      <div className="flex justify-center items-center h-20">
        <Image
          src="/Logo_Zenrp.png"
          width={75}
          height={75}
          alt="Logotipo"
          priority
          unoptimized
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-6">
        <p className="text-base font-thin">{name}</p>
        {profilePicture ? (
          <Image
            unoptimized
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
          { label: "Agendamentos", href: "/dashboard/schedules" },
          { label: "Atividades", href: "/dashboard/activities" },
          { label: "Membros", href: "/dashboard/members" },
          { label: "Postagens", href: "/dashboard/posts" },
          { label: "Relatórios", href: "/dashboard/reports" },
          { label: "Sair", onClick: handleSignOut },
        ]}
        onItemClick={() => setIsOpen(false)}
      />
    </div>
  );

  return (
    <>
      <div className="lg:hidden flex flex-col items-center bg-rich-black text-white px-4 pt-8 sticky top-0 z-40 border-b border-gray-800 gap-5">
        <Image
          src="/Logo_Zenrp.png"
          width={100}
          height={0}
          alt="Logotipo"
          unoptimized
        />
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setIsOpen(true)}
          className="p-2 cursor-pointer"
        >
          <FaBars size={26} />
        </button>
      </div>

      <nav className="hidden lg:flex lg:flex-col w-64 max-w-64 min-w-50 bg-rich-black text-white pt-8 sticky top-0 h-screen border-r border-gray-800">
        {content}
      </nav>

      <div
        onClick={() => setIsOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <nav
        className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-rich-black text-white pt-8 z-50 border-r border-gray-800 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 cursor-pointer"
        >
          <FaTimes size={20} />
        </button>
        {content}
      </nav>
    </>
  );
}
