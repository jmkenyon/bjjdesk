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

  const dropIn = await prisma.dropIn.findUnique({
    where: { gymId: gym.id },
    include: { documents: true },
  })

  const dropInDocIds = dropIn?.documents.map(doc => doc.id);

  return (
   
      <QrView gym={gym} docs={docs} dropIn={dropIn} dropInDocIds={dropInDocIds}/>
  
  );
};

export default Page;
