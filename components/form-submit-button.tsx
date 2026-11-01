"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type FormSubmitButtonProps = React.ComponentProps<typeof Button> & {
  pendingLabel?: string;
};

export function FormSubmitButton({
  children,
  pendingLabel,
  className,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={cn(pending && "gap-2", className)}
      {...props}
    >
      {pending ? (
        <>
          <Spinner className="size-4" aria-label={t("a11y.loading")} />
          {pendingLabel ?? t("common.pleaseWait")}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
