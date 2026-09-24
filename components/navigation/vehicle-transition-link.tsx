import Link from "next/link";
import type { ReactNode } from "react";

type VehicleTransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function VehicleTransitionLink({
  href,
  children,
  className,
  "aria-label": ariaLabel,
}: VehicleTransitionLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}