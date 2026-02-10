import React from "react";

export default function Header({ step }: { step: 1 | 2 }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-95" />
      <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-24 -right-28 h-72 w-72 rounded-full bg-black/10 blur-2xl" />

      <div className="relative px-6 py-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Match OU
            </h1>
            <p className="mt-1 text-sm text-white/85">
              Fill it out • We match you • UI-only for now
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">
            Section {step} / 2
          </div>
        </div>
      </div>
    </div>
  );
}
