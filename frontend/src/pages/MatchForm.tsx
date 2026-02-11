// frontend/src/pages/MatchForm.tsx
import { useMemo, useState } from "react";
import Card from "../ui/Card";
import Header from "../ui/Header";
import FormSection from "../ui/FormSection";
import InputField from "../ui/InputField";
import PillSelect from "../ui/PillSelect";
import YesNoToggle from "../ui/YesNoToggle";
import FooterNav from "../ui/FooterNav";

type Step = 1 | 2;

type BasicState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  age: string;
  gender: "male" | "female" | "";
  photo: File | null;
  personality: string[];
  hasCar: "yes" | "no";
  canDriveDate: "yes" | "no";
};

type PrefsState = {
  dateType: string[];
  specificPerson: string;
  dateGroup: "single" | "double" | "triple";
  friend1: string;
  friend2: string;
  locations: string[];
  desiredTraits: string[];
  otherActivity: string;
  typeDesc: string;
  consent: boolean;
};

export default function MatchForm() {
  const [step, setStep] = useState<Step>(1);

  const [basic, setBasic] = useState<BasicState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    photo: null,
    personality: [],
    hasCar: "yes",
    canDriveDate: "yes",
  });

  const [prefs, setPrefs] = useState<PrefsState>({
    dateType: [],
    specificPerson: "",
    dateGroup: "single",
    friend1: "",
    friend2: "",
    locations: [],
    desiredTraits: [],
    otherActivity: "",
    typeDesc: "",
    consent: false,
  });

  const personalityOptions = useMemo(
    () => [
      "Calm",
      "Outgoing",
      "Funny",
      "Talkative",
      "Reserved",
      "Adventurous",
      "Ambitious",
      "Creative",
      "Laid-back",
    ],
    []
  );

  const dateTypeOptions = useMemo(
    () => ["Dinner", "Coffee", "Study date", "Movie", "Walk", "Game night"],
    []
  );

  const locationOptions = useMemo(
    () => ["On-campus", "Off-campus", "Downtown", "Quiet spot", "Sports event"],
    []
  );

  const traitOptions = useMemo(
    () => ["Kind", "Funny", "Driven", "Chill", "Communicative", "Respectful"],
    []
  );

  // ✅ Gender is REQUIRED to go next
  const canGoNext =
    step === 1
      ? Boolean(
          basic.firstName.trim() &&
            basic.lastName.trim() &&
            basic.email.trim() &&
            basic.age.trim() &&
            basic.gender !== ""
        )
      : prefs.consent;

  function onNext() {
    if (!canGoNext) return;
    setStep(2);
  }

  function onBack() {
    setStep(1);
  }

  // ✅ Post DIRECTLY to backend (no proxy needed)
  async function onSubmit(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) {
    e?.preventDefault?.();

    // ✅ Don't try to JSON stringify the File itself
    const payload = {
      basic: {
        ...basic,
        photo: undefined,
        photoName: basic.photo ? basic.photo.name : "",
      },
      prefs,
    };

    try {
      const res = await fetch("http://localhost:5001/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Request failed");
      }

      alert("Saved to CSV ✅");
    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 sm:p-8"
      style={{
        background:
          "radial-gradient(1200px 700px at 12% 10%, rgba(99,102,241,.22), transparent 60%), radial-gradient(900px 600px at 90% 20%, rgba(236,72,153,.20), transparent 55%), #f7f9ff",
      }}
    >
      <div className="w-full max-w-5xl">
        <Card>
          <Header step={step} />

          {/* ✅ Wrap in a form so Enter key works; preventDefault blocks navigation */}
          <form onSubmit={onSubmit}>
            <div className="p-5 sm:p-7">
              {step === 1 ? (
                <FormSection
                  title="SECTION 1 — Basic info"
                  subtitle="Fill this out so we can match you better. (UI-only for now)"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First name"
                      placeholder="Dylan"
                      value={basic.firstName}
                      onChange={(v) =>
                        setBasic((s) => ({ ...s, firstName: v }))
                      }
                    />

                    <InputField
                      label="Last name"
                      placeholder="Jules"
                      value={basic.lastName}
                      onChange={(v) => setBasic((s) => ({ ...s, lastName: v }))}
                    />

                    <InputField
                      label="Phone number"
                      placeholder="(256) 555-0123"
                      value={basic.phone}
                      onChange={(v) => setBasic((s) => ({ ...s, phone: v }))}
                    />

                    <InputField
                      label="Email"
                      placeholder="you@oakwood.edu"
                      value={basic.email}
                      onChange={(v) => setBasic((s) => ({ ...s, email: v }))}
                    />

                    <InputField
                      label="Age"
                      placeholder="19"
                      value={basic.age}
                      onChange={(v) => setBasic((s) => ({ ...s, age: v }))}
                    />

                    {/* GENDER (required for Next) */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700">
                        Gender <span className="text-rose-500">*</span>
                      </div>

                      <div className="flex gap-2">
                        {(["male", "female"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() =>
                              setBasic((s) => ({ ...s, gender: g }))
                            }
                            className={[
                              "rounded-full border px-4 py-2 text-sm shadow-sm transition",
                              basic.gender === g
                                ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            {g === "male" ? "Male" : "Female"}
                          </button>
                        ))}
                      </div>

                      {!basic.gender && (
                        <div className="text-xs text-slate-500">
                          Select a gender to continue.
                        </div>
                      )}
                    </div>

                    {/* PHOTO */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700">
                        Photo (optional)
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setBasic((s) => ({
                            ...s,
                            photo: e.target.files?.[0] ?? null,
                          }))
                        }
                      />
                      {basic.photo ? (
                        <div className="text-xs text-slate-500">
                          Selected: {basic.photo.name}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <PillSelect
                      label="Personality (multi-select)"
                      options={personalityOptions}
                      value={basic.personality}
                      onChange={(next) =>
                        setBasic((s) => ({ ...s, personality: next }))
                      }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <YesNoToggle
                        label="Do you have a car?"
                        value={basic.hasCar}
                        onChange={(v) => setBasic((s) => ({ ...s, hasCar: v }))}
                      />

                      <YesNoToggle
                        label="Willing to drive your date?"
                        value={basic.canDriveDate}
                        onChange={(v) =>
                          setBasic((s) => ({ ...s, canDriveDate: v }))
                        }
                      />
                    </div>
                  </div>
                </FormSection>
              ) : (
                <FormSection
                  title="SECTION 2 — Preferences"
                  subtitle="Tell us what you’re looking for."
                >
                  <div className="space-y-5">
                    <InputField
                      label="Is there a specific person you'd like to take on a date?"
                      placeholder="Ex: Kim Kardashian"
                      value={prefs.specificPerson}
                      onChange={(v) =>
                        setPrefs((s) => ({ ...s, specificPerson: v }))
                      }
                    />

                    <PillSelect
                      label="Date type (multi-select)"
                      options={dateTypeOptions}
                      value={prefs.dateType}
                      onChange={(next) =>
                        setPrefs((s) => ({ ...s, dateType: next }))
                      }
                    />

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700">
                        Do you wanna go on a single date, double date, or triple
                        date?
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(["single", "double", "triple"] as const).map(
                          (opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setPrefs((s) => ({
                                  ...s,
                                  dateGroup: opt,
                                  friend1: opt === "single" ? "" : s.friend1,
                                  friend2: opt !== "triple" ? "" : s.friend2,
                                }))
                              }
                              className={[
                                "rounded-full border px-3 py-1.5 text-sm shadow-sm transition",
                                prefs.dateGroup === opt
                                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              {opt === "single"
                                ? "Single date"
                                : opt === "double"
                                ? "Double date"
                                : "Triple date"}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {(prefs.dateGroup === "double" ||
                      prefs.dateGroup === "triple") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Friend 1 (optional)"
                          placeholder="Name"
                          value={prefs.friend1}
                          onChange={(v) =>
                            setPrefs((s) => ({ ...s, friend1: v }))
                          }
                        />

                        {prefs.dateGroup === "triple" && (
                          <InputField
                            label="Friend 2 (optional)"
                            placeholder="Name"
                            value={prefs.friend2}
                            onChange={(v) =>
                              setPrefs((s) => ({ ...s, friend2: v }))
                            }
                          />
                        )}
                      </div>
                    )}

                    <PillSelect
                      label="Preferred location (multi-select)"
                      options={locationOptions}
                      value={prefs.locations}
                      onChange={(next) =>
                        setPrefs((s) => ({ ...s, locations: next }))
                      }
                    />

                    <PillSelect
                      label="Desired traits (multi-select)"
                      options={traitOptions}
                      value={prefs.desiredTraits}
                      onChange={(next) =>
                        setPrefs((s) => ({ ...s, desiredTraits: next }))
                      }
                    />

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700">
                        Anything else you want to add?
                      </div>

                      <textarea
                        value={prefs.typeDesc}
                        onChange={(e) =>
                          setPrefs((s) => ({
                            ...s,
                            typeDesc: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        placeholder="Ex: I like chill dates, good communication, and someone who’s respectful..."
                      />
                    </div>

                    <InputField
                      label="Other activity (optional)"
                      placeholder="Bowling, museum, etc."
                      value={prefs.otherActivity}
                      onChange={(v) =>
                        setPrefs((s) => ({ ...s, otherActivity: v }))
                      }
                    />

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <input
                        type="checkbox"
                        checked={prefs.consent}
                        onChange={(e) =>
                          setPrefs((s) => ({
                            ...s,
                            consent: e.target.checked,
                          }))
                        }
                      />

                      <div className="text-sm text-slate-700">
                        I understand this is a UI prototype and agree to submit
                        this information for matching purposes.
                      </div>
                    </label>
                  </div>
                </FormSection>
              )}

              <div className="mt-6">
                <FooterNav
                  step={step}
                  canGoNext={canGoNext}
                  onBack={onBack}
                  onNext={onNext}
                  onSubmit={onSubmit}
                />
              </div>
            </div>
          </form>
        </Card>

        <div className="mt-3 text-center text-xs text-slate-500">
          OU Match • UI prototype
        </div>
      </div>
    </div>
  );
}
