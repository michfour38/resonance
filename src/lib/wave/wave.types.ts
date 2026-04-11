export type WaveMembershipState = "PRE_WAVE" | "ACTIVE" | "COMPLETED";

export type WavePhase = "PRE_WAVE" | "CORE" | "INTEGRATION" | "COMPLETED";

export type WaveProgression = {
  phase: WavePhase;
  weekNumber: number | null;
  dayNumber: number | null;
  elapsedDays: number | null;
  startsAt: Date;
};

export type MemberWaveContext = {
  membership: {
    id: string;
    state: WaveMembershipState;
    joinedAt: Date;
    activatedAt: Date | null;
    completedAt: Date | null;
  };
  wave: {
    id: string;
    name: string;
    startsAt: Date;
  };
  progression: WaveProgression;
};