import { InspectOutline } from "@/app/componentes/inspect-outline";

type PageTitleProps = {
  title: string;
};

// Figma Display/XL: 176px desktop, 96px mobile.
export const PageTitle = ({ title }: PageTitleProps) => (
  <h1 className="group relative w-fit max-w-full break-words font-display text-display-title-s text-text md:text-display-xl">
    {title}
    <InspectOutline variant="hover" measure selector="h1" />
  </h1>
);
