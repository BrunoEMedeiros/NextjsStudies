"use client";
import Link from "next/link";

type ListItemsProps = {
  label: string;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void; // Added event typing
};

interface NavBarItemsProps {
  items: ListItemsProps[];
  onItemClick?: () => void;
}

export default function NavBarItems({ items, onItemClick }: NavBarItemsProps) {
  return (
    <ul className="flex-1 flex flex-col">
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} onClick={onItemClick}>
            <li className="flex py-5 px-4 justify-center items-center hover:bg-earth-yellow hover:text-rich-black text-base text-light-coral font-light hover:cursor-pointer">
              <p>{item.label}</p>
            </li>
          </Link>
        ) : (
          <li
            key={item.label}
            onClick={(e) => {
              item.onClick?.(e);
              onItemClick?.();
            }}
            className="flex py-5 px-4 justify-center items-center hover:bg-earth-yellow hover:text-rich-black text-base text-light-coral font-light hover:cursor-pointer"
          >
            <p>{item.label}</p>
          </li>
        )
      )}
    </ul>
  );
}
