export default function YesNoToggle({
  label,
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
}: {
  label: string;
  value: "yes" | "no";
  onChange: (v: "yes" | "no") => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>

      <div className="inline-flex rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200">
        <button
          type="button"
          onClick={() => onChange("yes")}
          className={[
            "px-4 py-2 text-sm font-semibold rounded-lg transition",
            value === "yes"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-600",
          ].join(" ")}
        >
          {yesLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className={[
            "px-4 py-2 text-sm font-semibold rounded-lg transition",
            value === "no"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-600",
          ].join(" ")}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );
}
