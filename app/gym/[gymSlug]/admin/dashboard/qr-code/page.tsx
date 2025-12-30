import EmptyState from "@/app/components/EmptyState";
import QrView from "@/app/gym/components/QrView";
import prisma from "@/app/lib/prisma";

interface IParams {
  gymSlug: string;
}

const Page = async ({ params }: { params: Promise<IParams> }) => {
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

  const docs = await prisma.document.findMany({
    where: { gymId: gym.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mt-10 rounded-lg border bg-white p-6 shadow-sm">
      <QrView gym={gym} docs={docs} />
    </section>
  );
};

export default Page;
