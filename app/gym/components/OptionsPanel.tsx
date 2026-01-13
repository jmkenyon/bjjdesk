import { getSession } from "next-auth/react";
import AdminSidebar from "./AdminSidebar";
import StudentSidebar from "./StudentSidebar";

interface OptionsPanelProps {
  gymSlug: string;
}

const OptionsPanel = async ({ gymSlug }: OptionsPanelProps) => {
  const session = await getSession();

  return (
    <section className="md:w-75 border-r-2 border-black  bg-blue-400 h-screen">
      {session?.user.role === "ADMIN" ? (
        <AdminSidebar gymSlug={gymSlug} />
      ) : (
        <StudentSidebar gymSlug={gymSlug} />
      )}
    </section>
  );
};

export default OptionsPanel;
