import type { CustomerAccount } from "../../server/aggregator/customer-auth.ts";
import type { SupportedLocale } from "../localization-contract.ts";
import { getAccountShellNavigationCopy } from "../locale/account/sections/shell-navigation.ts";

export type AccountShellProfile = {
  displayName: string;
  initials: string;
  sunSign: string;
  risingSign: string;
  membership: string;
};

const fixtureDisplayName = "Mara Ellison";
const sunSignByLocale: Record<SupportedLocale, string> = {
  en: "Leo",
  es: "Leo",
  fr: "Lion",
  pt: "Leão",
  ru: "Лев",
  it: "Leone",
  de: "Löwe",
};

const initialsFor = (displayName: string) =>
  (displayName.trim()[0] ?? "M").toUpperCase();

export const prepareAccountShellProfile = (
  locale: SupportedLocale,
  account?: CustomerAccount | null,
): AccountShellProfile => {
  const copy = getAccountShellNavigationCopy(locale);
  const displayName = account?.displayName?.trim() || fixtureDisplayName;

  return {
    displayName,
    initials: initialsFor(displayName),
    sunSign: sunSignByLocale[locale] ?? sunSignByLocale.en,
    risingSign: copy.risingLabel,
    membership: copy.memberLabel,
  };
};
