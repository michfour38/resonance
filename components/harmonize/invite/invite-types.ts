export const BASE_INCLUDED_PARTICIPANTS = 2
export const BASE_PRICE = 1200
export const EXTRA_PARTICIPANT_PRICE = 300
export const SELF_SERVE_MAX_PARTICIPANTS = 10

export const RELATIONSHIP_CONTEXTS = [
  "Partner",
  "Co-parent",
  "Sibling",
  "Parent",
  "Adult child",
  "Friend",
  "Colleague",
  "Client",
  "Other",
]

export type InviteParticipant = {
  email: string
  relationshipContext: string
}