import { Button } from "@/components/ui/button"
import { Membership } from "@prisma/client"

interface MembershipCardProps {
    memberships: Membership[]
}


const MembershipCard = ({memberships}: MembershipCardProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {memberships.map((membership) => (
      <div
        key={membership.id}
        className="group rounded-lg border bg-white shadow-sm "
      >

        <div className="p-4 border-b border-black">
          <h2 className="text-lg font-semibold text-slate-800 line-clamp-2">
            {membership.title}
          </h2>
        </div>


        <div className="p-4 flex flex-col gap-3 flex-1">
          <p className="text-sm text-slate-600 line-clamp-3">
            {membership.description || "No description provided"}
          </p>
        </div>


        <div className="p-4 border-t border-black flex items-center justify-between">
          <span className="inline-flex items-center  bg-emerald-400 border-black border px-3 py-2 text-sm font-semibold text-black">
            ${membership.price}
          </span>
          <Button variant={"outline"}>
            Edit
          </Button>
       
        </div>
      </div>
    ))}
  </div>
  )
}

export default MembershipCard