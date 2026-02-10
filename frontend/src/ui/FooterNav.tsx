type Step = 1 | 2;

export default function FooterNav({
  step,
  canGoNext,
  onBack,
  onNext,
  onSubmit,
}: {
  step: Step;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={step === 1}
        className={[
          "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
          step === 1
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
        ].join(" ")}
      >
        Back
      </button>

      {step === 1 ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={[
            "rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition",
            canGoNext
              ? "bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-95"
              : "bg-slate-300 cursor-not-allowed",
          ].join(" ")}
        >
          Continue
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canGoNext}
          className={[
            "rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition",
            canGoNext
              ? "bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-95"
              : "bg-slate-300 cursor-not-allowed",
          ].join(" ")}
        >
          Submit
        </button>
      )}
    </div>
  );
}
