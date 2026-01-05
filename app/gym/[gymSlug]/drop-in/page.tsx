import EmptyState from "@/app/components/EmptyState";
import NavbarDashboard from "../../components/NavbarDashboard";
import prisma from "@/app/lib/prisma";
import DropInView from "../../components/DropInView";
import { generateTenantURL } from "@/app/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface IParams {
  gymSlug: string;
}

const DropInPage = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact gym for assistance" />
    );
  }

  const waiver = await prisma.waiver.findUnique({
    where: { gymId: gym.id },
  });

  const dropIn = await prisma.dropIn.findUnique({
    where: { gymId: gym.id },
  });

  return (
    <main className="h-screen bg-neutral-100">
      <NavbarDashboard gymName={gym.name} gymSlug={gym.slug} />
      <section className="space-y-16 px-6 py-12 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Drop-in to {gym.name}
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            Follow the instructions below to start training!
          </p>
        </div>
        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-2">Already have an account?</h2>
          <p className="text-sm text-slate-600 mb-6">
            Log in to skip the form and sign up faster.
          </p>
          <Button className="bg-black">
            <Link href={`${generateTenantURL(gym.slug)}/student`}>Login</Link>
          </Button>
        </section>
        {dropIn ? (
          <DropInView gym={gym} waiver={waiver} dropIn={dropIn} />
        ) : (
          <EmptyState
            title="Gym is not set up for drop-ins"
            subtitle="Please contact the gym for assistance"
          />
        )}
      </section>
    </main>
  );
};

export default DropInPage;
