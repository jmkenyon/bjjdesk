import prisma from "@/app/lib/prisma";
import NavbarDashboard from "../components/NavbarDashboard";
import EmptyState from "@/app/components/EmptyState";
import Calendar from "../components/Calendar";
import { Button } from "@/components/ui/button";

interface IParams {
  gymSlug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<IParams>;
}) {
  const resolvedParams = await params;
  const gym = await prisma.gym.findUnique({
    where: { slug: resolvedParams.gymSlug },
    select: {
      name: true,
      address: true,
      about: true,
    },
  });

  if (!gym) {
    return {
      title: "Gym not found | BJJ Desk",
    };
  }

  const city = gym.address?.split(",")[0] ?? "";

  return {
    title: `${gym.name} | Brazilian Jiu-Jitsu Gym${city ? ` in ${city}` : ""}`,
    description:
      gym.about ??
      `Train Brazilian Jiu-Jitsu at ${gym.name}. View class timetable, memberships, and join today.`,
    openGraph: {
      title: `${gym.name} | BJJ Desk`,
      description: gym.about ?? `Train Brazilian Jiu-Jitsu at ${gym.name}.`,
      type: "website",
    },
  };
}

const GymPage = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const gym = await prisma.gym.findUnique({
    where: {
      slug: resolvedParams.gymSlug,
    },
  });

  if (!gym) {
    return (
      <EmptyState title="Gym not found" subtitle="Contact us for assistance" />
    );
  }

  const classes = await prisma.class.findMany({
    where: {
      gymId: gym.id,
    },
  });

  return (
    <main className="h-screen bg-neutral-100">
      <NavbarDashboard gymName={gym.name} gymSlug={gym.slug} />
      <section className="space-y-16 px-6 py-12 lg:px-12">
        {/* About */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            About the Gym
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            {gym.about ||
              "Train Brazilian Jiu-Jitsu in a welcoming environment."}
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border bg-white px-8 py-10 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              Start training today
            </h3>
            <p className="max-w-sm text-center text-sm text-slate-600">
              Whether you’re brand new or experienced, we’ll help you get
              started.
            </p>

            {gym.freeTrial ? (
              <Button
                size="lg"
                className="rounded-xl bg-black px-8 text-white hover:bg-blue-700"
              >
                Book a free trial
              </Button>
            ) : (
              <Button
                size="lg"
                className="rounded-xl bg-black px-8 text-white hover:bg-blue-700"
              >
                Join now
              </Button>
            )}
          </div>
        </div>

        {/* Timetable */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              Class Timetable
            </h2>
            <p className="text-sm text-slate-600">
              Weekly schedule of all available classes
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <Calendar classes={classes} />
          </div>
        </div>
        {/* Location */}
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Location</h2>

          <p className="text-base text-slate-600">
            Train with us at our gym location below.
          </p>

          <div className="mx-auto w-full max-w-xl rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-800">{gym.address}</p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                gym.address ?? ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center text-sm font-medium text-blue-600 hover:underline"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GymPage;
