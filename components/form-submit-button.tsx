"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
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

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={cn(pending && "gap-2", className)}
      {...props}
    >
      {pending ? (
        <>
          <Spinner className="size-4" />
          {pendingLabel ?? "Please wait..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
