import EmptyState from "@/app/components/EmptyState";
import DashboardWrapper from "@/app/gym/components/DashboardWrapper";
import { StudentProfileForm } from "@/app/gym/components/StudentProfile";
import { getCurrentUser } from "@/app/hooks/getCurrentUser";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <EmptyState title="Please log in again" />;
  }
  return (
    <DashboardWrapper
      title="Your profile"
      subtitle="View and update your information below"
    >
        <StudentProfileForm user={user}/>
    </DashboardWrapper>
  );
};

export default Page;
