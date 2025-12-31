import EmptyState from "@/app/components/EmptyState";
import MembershipCard from "@/app/gym/components/MembershipCard";
import { MembershipModal } from "@/app/gym/components/MembershipModal";
import prisma from "@/app/lib/prisma";

interface IParams {
  gymSlug: string;
}

const page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: {
      slug: resolvedParams.gymSlug,
    },
  });

  if (!gym) {
    return (
      <EmptyState
        title="Gym not found"
        subtitle="Contact your gym for assistance"
      />
    );
  }

  const memberships = await prisma.membership.findMany({
    where: {
      gymId: gym.id,
    },
  });

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Gym memberships</h2>
        <p className="mt-1 mb-2 text-sm text-slate-600 max-w-prose">
          Manage your gym&apos;s membership plans here.
        </p>
        <MembershipModal gym={gym} memberships={memberships} />
      </div>

      {memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border  bg-slate-50  text-center p-10">
          <h2 className="text-base font-semibold text-slate-800">
            No active memberships
          </h2>
          <p className="max-w-sm text-sm text-slate-600">
            Create a membership to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-md border bg-slate-50 p-6">
         <MembershipCard memberships={memberships}/>
        </div>
      )}
    </>
  );
};

export default page;
