import { Link } from "@/app/componentes/link";
import { cn } from "@/app/lib/utils";
import type { Social } from "@/app/types/page-info";
import { getSocialLabel } from "@/app/utils/socials";

type SocialLinksProps = {
  socials: Social[];
  /** Classes for the `ul` (layout and spacing). */
  className?: string;
  /** Hook for the hero intro animation. */
  "data-hero"?: string;
};

/** Renders nothing when there are no socials, so no empty list reaches the DOM. */
export const SocialLinks = ({ socials, className, "data-hero": dataHero }: SocialLinksProps) => {
  if (socials.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap", className)} data-hero={dataHero}>
      {socials.map((social) => (
        <li key={social.url}>
          <Link href={social.url} className="text-label-m">
            {getSocialLabel(social)}
          </Link>
        </li>
      ))}
    </ul>
  );
};
