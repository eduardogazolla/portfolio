import type { ReactNode } from "react";
import { InspectOutline } from "@/app/componentes/inspect-outline";
import { PageSection } from "@/app/componentes/page-section";

type StatusPageProps = {
  /** Big decorative code (e.g. "404"), drawn inside a dashed inspect outline. */
  code: string;
  /** Tag text of the outline; defaults to "element not found". */
  label?: string;
  title: string;
  description: string;
  /** Buttons row. */
  children: ReactNode;
};

// Shared layout of the 404 and error pages (Figma 12:385 desktop / 12:583 mobile):
// big code with dashed outline on the left, message and actions on the right (stacked on mobile).
export const StatusPage = ({ code, label, title, description, children }: StatusPageProps) => (
  <PageSection
    className="py-20 lg:py-32"
    innerClassName="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-20"
  >
    <div aria-hidden="true" className="relative w-fit select-none px-3 py-2 lg:px-6 lg:py-3">
      <span className="block font-display text-[160px] font-extrabold leading-[0.88] tracking-[-0.04em] text-text lg:text-[360px]">
        {code}
      </span>
      <InspectOutline variant="dashed" label={label} />
    </div>
    <div className="flex flex-col gap-6 lg:max-w-[460px]">
      <h1 className="font-display text-h2 text-text lg:text-h1">{title}</h1>
      <p className="text-body-m text-text-muted lg:text-body-l">{description}</p>
      <div className="flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">{children}</div>
    </div>
  </PageSection>
);
