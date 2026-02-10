import type { ReactNode } from "react";

export default function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-5">
        <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          {title}
        </div>
        {subtitle && (
          <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
