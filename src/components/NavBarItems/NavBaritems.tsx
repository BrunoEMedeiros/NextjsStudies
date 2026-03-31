"use client";
import Link from "next/link";

type ListItemsProps = {
  label: string;
  href: string;
  onClick?: Function;
};

interface NavBarItemsProps {
  items: ListItemsProps[];
}

export default function NavBarItems({ items }: NavBarItemsProps) {
  return (
    <ul className="flex-1 flex flex-col justify-around">
      {items.map((item) => {
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={
              item.onClick
                ? () => {
                    item.onClick;
                  }
                : () => {}
            }
          >
            <li className="flex py-5 px-4 justify-center items-center hover:bg-earth-yellow hover:text-rich-black text-base text-light-coral font-light hover:cursor-pointer">
              <p>{item.label}</p>
            </li>
          </Link>
        );
      })}
    </ul>
  );
}
