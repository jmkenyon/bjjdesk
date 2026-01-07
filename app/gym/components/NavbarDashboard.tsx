import NavButton from "@/app/components/NavButton";
import { generateTenantURL } from "@/app/lib/utils";
import Link from "next/link";

interface NavbarDashboardProps {
  gymName: string;
  gymSlug: string;
}

const NavbarDashboard = ({ gymName, gymSlug }: NavbarDashboardProps) => {
  return (
    <nav className="bg-white  border-b-2 border-black flex flex-row items-center justify-between">
      <Link href={`${generateTenantURL(gymSlug)}`}>
        <h1 className="text-black font-semibold sm:text-lg text-base ml-5">
          {gymName}
        </h1>
      </Link>
      <div className="flex">
        {/* Desktop */}
        <Link
          href={`${generateTenantURL(gymSlug)}/student`}
          className="hidden sm:block"
        >
          <NavButton className="bg-white text-black">Student Login</NavButton>
        </Link>
        <Link
          href={`${generateTenantURL(gymSlug)}/admin`}
          className="hidden sm:block"
        >
          <NavButton className="bg-black text-white">Admin Login</NavButton>
        </Link>

        {/* Mobile */}
        <Link
          href={`${generateTenantURL(gymSlug)}/student`}
          className="block sm:hidden"
        >
          <NavButton className="bg-white text-black">Student</NavButton>
        </Link>
        <Link
          href={`${generateTenantURL(gymSlug)}/admin`}
          className="block sm:hidden"
        >
          <NavButton className="bg-black text-white">Admin</NavButton>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
