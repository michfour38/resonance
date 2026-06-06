import { redirect } from "next/navigation"

export default function HarmonizeIntegrationRedirect({
  params,
}: {
  params: { systemId: string; cycleId: string }
}) {
  redirect(
    `/harmonize/system/${params.systemId}/cycle/${params.cycleId}/review`,
  )
}