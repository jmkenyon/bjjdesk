import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <Navbar />

      <section className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-24 lg:flex-row">

        <div className="flex max-w-xl flex-col gap-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Simple gym management software
            <br />
            <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              built for BJJ gyms
            </span>
          </h1>

          <p className="text-lg text-neutral-600">
            Manage memberships, attendance, and payments without spreadsheets,
            WhatsApp chaos, or overpriced software.
          </p>

          <p className="text-base text-neutral-700">
            Become a founding member and lock in a{" "}
            <span className="font-semibold">
              lifetime price of £15/month
            </span>{" "}
            — includes a 30-day free trial.
          </p>

 
          <div className="mt-4 flex items-center gap-4">
            <Link
              href="/free-trial"
              className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Start free trial
            </Link>


          </div>
        </div>


        <div className="relative w-full max-w-xl">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-tr from-blue-200/40 to-transparent blur-2xl" />

          <Image
            src="/hero-image.webp"
            alt="BJJ Desk dashboard preview"
            width={900}
            height={900}
            className="rounded-3xl object-cover shadow-2xl"
            priority
          />
        </div>
      </section>
    </main>
  );
}