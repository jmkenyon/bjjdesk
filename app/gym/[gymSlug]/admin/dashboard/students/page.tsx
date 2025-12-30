import EmptyState from "@/app/components/EmptyState";
import { Modal } from "@/app/gym/components/Modal";
import StudentsTable from "@/app/gym/components/StudentsTable";
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
    include: {
      users: {
        where: {
          role: "STUDENT",
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact us for assistance" />
    );
  }

  return (
    <section className="h-full bg-neutral-100">
      <Modal gym={gym} />

      <StudentsTable gym={gym} />
    </section>
  );
};

export default page;
