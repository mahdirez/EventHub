"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

type CopyInviteLinkButtonProps = {
  token: string | null;
};

export function CopyInviteLinkButton({ token }: CopyInviteLinkButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!token) {
      return;
    }

    const url = `${window.location.origin}/invite/${token}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("toast.inviteCopied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("toast.inviteCopyFailed"));
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      disabled={!token}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? t("common.copied") : t("common.copyLink")}
    </Button>
  );
}
