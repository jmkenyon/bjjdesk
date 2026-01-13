"use client"

import { generateTenantURL } from "@/app/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";

interface PanelItemProps {
  icon: IconType;
  title: string;
  URLOveride?: string;
  gymSlug: string;
  type: "admin" | "student"
}

const PanelItem = ({
  icon: Icon,
  title,
  URLOveride,
  gymSlug,
  type
}: PanelItemProps) => {
    const pathname = usePathname()
    const active = pathname.endsWith(URLOveride ? URLOveride : title.toLowerCase())

  return (
    <Link href={`${generateTenantURL(gymSlug)}/${type}/dashboard/${URLOveride ?? title.toLowerCase()}`}>
      <li className={cn("flex flex-row items-center gap-3 cursor-pointer transition-colors hover:bg-black hover:text-white p-5",
      active && "bg-black font-semibold text-white/90"

      )}>
        <Icon size={20} />

        <p className="sm:block hidden">{title}</p>
      </li>
    </Link>
  );
};

export default PanelItem;
