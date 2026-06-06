import { redirect } from "next/navigation"

export default function HarmonizeRecognitionRedirect({
  params,
}: {
  params: { systemId: string; cycleId: string }
}) {
  redirect(
    `/harmonize/system/${params.systemId}/cycle/${params.cycleId}/question/where_you_go_inside`,
  )
}