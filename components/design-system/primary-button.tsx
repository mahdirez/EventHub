import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PrimaryButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  showArrow?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function PrimaryButton({
  children,
  href,
  className,
  showArrow = true,
  type = "button",
  onClick,
}: PrimaryButtonProps) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:brightness-110 btn-primary-gradient",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {showArrow ? <ArrowRightIcon className="size-4" aria-hidden /> : null}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
      {showArrow ? <ArrowRightIcon className="size-4" aria-hidden /> : null}
    </button>
  );
}
