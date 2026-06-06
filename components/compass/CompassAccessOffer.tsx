type CompassAccessOfferProps = {
  onFirstMonth: () => void;
  onMonthly: () => void;
  onAnnual: () => void;
};

export function CompassAccessOffer({
  onFirstMonth,
  onMonthly,
  onAnnual,
}: CompassAccessOfferProps) {
  return (
    <div className="rounded-[2rem] border border-[#2a2418] bg-[#10100f] p-6 text-stone-100">
      <p className="mb-3 text-xs uppercase tracking-[0.34em] text-[#d8b15f]">
        Compass Access
      </p>

      <h1 className="text-2xl font-semibold">
        Enter Compass for one month.
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
        Start with one full month of Compass access. No automatic renewal.
        Return, continue discussions, begin new sessions, and review previous
        sessions during your access period.
      </p>

      <button onClick={onFirstMonth} className="primary-button mt-6">
        Start first month · R520
      </button>

      <div className="mt-8 border-t border-[#2a2418] pt-6">
        <p className="text-sm font-medium text-stone-200">
          Continue after your first month
        </p>

        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Once you have experienced Compass, continue with monthly or annual
          access.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button onClick={onMonthly} className="secondary-button">
            Monthly Access · R520/month
          </button>

          <button onClick={onAnnual} className="secondary-button">
            Annual Access · R5720/year
          </button>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          Annual access includes 12 months for the price of 11.
        </p>
      </div>
    </div>
  );
}