interface NavBarItemsProps {
  label: string;
  href: string;
}

export default function NavBarItems({}) {
  return (
    <li className="flex p-4 justify-center items-center hover:bg-earth-yellow hover:text-rich_black text-base text-light-coral font-light hover:cursor-pointer">
      Atividades
    </li>
  );
}
