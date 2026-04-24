"use client";
import Link from "next/link";

type ListItemsProps = {
  label: string;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void; // Added event typing
};

interface NavBarItemsProps {
  items: ListItemsProps[];
}

export default function NavBarItems({ items }: NavBarItemsProps) {
  return (
    <ul className="flex-1 flex flex-col justify-around">
      {items.map((item) => {
        // If the item has an href, render it as a Next.js Link
        if (item.href) {
          return (
            <Link key={item.label} href={item.href}>
              <li className="flex py-5 px-4 justify-center items-center hover:bg-earth-yellow hover:text-rich-black text-base text-light-coral font-light hover:cursor-pointer">
                <p>{item.label}</p>
              </li>
            </Link>
          );
        }

        // If the item has NO href (like our "Sair" option), render it as a clickable action
        return (
          <li
            key={item.label}
            onClick={item.onClick}
            className="flex py-5 px-4 justify-center items-center hover:bg-earth-yellow hover:text-rich-black text-base text-light-coral font-light hover:cursor-pointer"
          >
            <p>{item.label}</p>
          </li>
        );
      })}
    </ul>
  );
}
