import prisma from "@/app/lib/prisma";
import EmptyState from "@/app/components/EmptyState";
import SubscriptionView from "@/app/gym/components/SubscriptionView";

interface IParams {
  gymSlug: string;
}

const page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
  });

  if (!gym) {
    return (
      <EmptyState
        title="Gym not found"
        subtitle="Please contact us for assistance"
      />
    );
  }



  return (
    <SubscriptionView gym ={gym} />
  );
};

export default page;
