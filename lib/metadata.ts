import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type PageMetadataOptions = {
  title: string;
  description?: string;
};

export function createPageMetadata({
  title,
  description = siteConfig.description,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
  };
}

const authPageTitles: Record<string, string> = {
  callback: "Auth callback",
  "email-otp": "Email verification",
  "forgot-password": "Forgot password",
  "magic-link": "Magic link",
  "recover-account": "Recover account",
  "reset-password": "Reset password",
  "sign-in": "Sign in",
  "sign-out": "Sign out",
  "sign-up": "Create account",
  "two-factor": "Two-factor authentication",
  "accept-invitation": "Accept invitation",
};

const accountPageTitles: Record<string, string> = {
  settings: "Account settings",
  security: "Security",
  teams: "Teams",
  "api-keys": "API keys",
  organizations: "Organizations",
};

export function getAuthPageTitle(path: string): string {
  return authPageTitles[path] ?? titleFromPath(path);
}

export function getAccountPageTitle(path: string): string {
  return accountPageTitles[path] ?? titleFromPath(path);
}

function titleFromPath(path: string): string {
  return path
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const homeMetadata: Metadata = {
  title: {
    absolute: siteConfig.name,
  },
  description: siteConfig.description,
};
