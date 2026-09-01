import type { Metadata } from "next";

import type { Dictionary, Translator } from "@/lib/i18n";

type PageMetadataOptions = {
  title: string;
  description?: string;
};

export function createPageMetadata({
  title,
  description,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
  };
}

const authPageTitleKeys: Record<string, keyof Dictionary["auth"]> = {
  callback: "callback",
  "email-otp": "emailOtp",
  "forgot-password": "forgotPassword",
  "magic-link": "magicLink",
  "recover-account": "recoverAccount",
  "reset-password": "resetPassword",
  "sign-in": "signIn",
  "sign-out": "signOut",
  "sign-up": "signUp",
  "two-factor": "twoFactor",
  "accept-invitation": "acceptInvitation",
};

const accountPageTitleKeys: Record<string, keyof Dictionary["account"]> = {
  settings: "settings",
  security: "security",
  teams: "teams",
  "api-keys": "apiKeys",
  organizations: "organizations",
};

export function getAuthPageTitle(path: string, t: Translator): string {
  const key = authPageTitleKeys[path];

  return key ? t(`auth.${key}`) : titleFromPath(path);
}

export function getAccountPageTitle(path: string, t: Translator): string {
  const key = accountPageTitleKeys[path];

  return key ? t(`account.${key}`) : titleFromPath(path);
}

function titleFromPath(path: string): string {
  return path
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
