import type { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-[0_20px_70px_rgba(15,23,42,0.12)] overflow-hidden">
      {children}
    </div>
  );
}
