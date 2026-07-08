import { RELATIONSHIP_CONTEXTS, type InviteParticipant } from "./invite-types"

type Props = {
  participants: InviteParticipant[]
  addParticipant: () => void
  removeParticipant: (index: number) => void
  updateParticipant: (
    index: number,
    field: keyof InviteParticipant,
    value: string,
  ) => void
}

export default function ParticipantList({
  participants,
  addParticipant,
  removeParticipant,
  updateParticipant,
}: Props) {
  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#f4f1ea]">Participants</p>

          <p className="mt-1 text-xs text-[#bfb8aa]">
            Add each person and how they are connected to this container.
          </p>
        </div>

        <button
          type="button"
          onClick={addParticipant}
          className="rounded-full border border-[#c6a96b]/40 px-4 py-2 text-sm text-[#c6a96b]"
        >
          + Add participant
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {participants.map((participant, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <label className="block text-sm leading-6 text-[#f4f1ea]">
              Participant {index + 1} email
            </label>

            <input
              type="email"
              value={participant.email}
              onChange={(event) =>
                updateParticipant(index, "email", event.target.value)
              }
              placeholder="participant@example.com"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-[#f4f1ea] outline-none placeholder:text-[#777] focus:border-[#c6a96b]/60"
            />

            <label className="mt-4 block text-sm leading-6 text-[#f4f1ea]">
              Relationship context
            </label>

            <select
              value={participant.relationshipContext}
              onChange={(event) =>
                updateParticipant(
                  index,
                  "relationshipContext",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-[#f4f1ea] outline-none focus:border-[#c6a96b]/60"
            >
              {RELATIONSHIP_CONTEXTS.map((context) => (
                <option key={context} value={context}>
                  {context}
                </option>
              ))}
            </select>

            {participants.length > 1 ? (
              <button
                type="button"
                onClick={() => removeParticipant(index)}
                className="mt-3 text-xs text-red-300"
              >
                Remove participant
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}