import { redirect } from "next/navigation"

export default function HarmonizeOwnershipRedirect({
  params,
}: {
  params: { systemId: string; cycleId: string }
}) {
  redirect(
    `/harmonize/system/${params.systemId}/cycle/${params.cycleId}/question/conceal`,
  )
}