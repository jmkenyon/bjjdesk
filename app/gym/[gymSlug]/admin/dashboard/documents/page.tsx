import EmptyState from "@/app/components/EmptyState";
import { DocumentsModal } from "@/app/gym/components/DocumentsModal";
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

  const docs = await prisma.document.findMany({
    where: { gymId: gym.id },
    orderBy: { createdAt: "desc" },
  });

  return <DocumentsModal gym={gym} docs={docs} />;
};

export default page;
