import { SocialLinks } from "@/app/componentes/social-links";
import { Social } from "@/app/types/page-info";

type FooterProps = {
  socials: Social[];
};

export const Footer = ({ socials }: FooterProps) => (
  <footer className="w-full border-t border-line px-5 pb-10 pt-7 lg:px-10 lg:py-8">
    <div className="mx-auto flex max-w-content flex-col-reverse items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-label-m text-text-muted">
        © {new Date().getFullYear()} Eduardo Gazolla
      </p>
      <SocialLinks socials={socials} className="gap-x-5 gap-y-2 lg:gap-x-7" />
    </div>
  </footer>
);
