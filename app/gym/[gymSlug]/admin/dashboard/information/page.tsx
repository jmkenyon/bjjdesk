import prisma from "@/app/lib/prisma"

import SettingsForm from '@/app/gym/components/SettingsForm'

interface IParams {
  gymSlug: string
}

const page = async ({params} : {params: Promise<IParams>}) => {
  const resolvedParams = await params

  const gym = await prisma.gym.findUnique({
    where: {
      slug: resolvedParams.gymSlug
    }
  })

  if (!gym) {
    return null
  }

  return (
    <section className="mt-5 rounded-lg border bg-white p-6 shadow-sm mb-6">
        <div className="mb-6">
        <h2 className="text-lg font-semibold">Gym information</h2>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Update information that will be displayed on your home page
        </p>
      </div>
      <SettingsForm gym={gym}/>
    </section>
  )
}

export default page