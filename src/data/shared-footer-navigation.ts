import type { HomePageContent } from "./public-copy.ts";
import {
  localizePath,
  type SupportedLocale,
} from "./localization-contract.ts";

type EditAttributes = Record<string, string>;

type FooterNavigationOptions = {
  content: HomePageContent;
  locale: SupportedLocale;
  editAttributes: (field: string) => EditAttributes;
};

const footerGroupDefinitions = [
  {
    labelField: "footer_group_charts",
    links: [
      ["footer_link_birth_chart", "/birth-chart"],
      ["footer_link_transit", "/transit"],
      ["footer_link_synastry", "/synastry"],
    ],
  },
  {
    labelField: "footer_group_tools",
    links: [
      ["footer_link_todays_sky", "/todays-sky"],
      ["footer_link_moon_calendar", "/moon-calendar"],
      ["footer_link_retrogrades", "/retrogrades"],
      ["footer_link_reports", "/reports"],
    ],
  },
  {
    labelField: "footer_group_learn",
    links: [
      ["footer_link_blog", "/blog"],
      ["footer_link_daily_horoscope", "/daily-horoscope"],
      ["footer_link_glossary", "/glossary"],
      ["footer_link_faq", "/faq"],
    ],
  },
  {
    labelField: "footer_group_company",
    links: [
      ["footer_link_about", "/about"],
      ["footer_link_account", "/account"],
      ["footer_link_shop", "/shop"],
    ],
  },
] as const;

const footerLegalDefinitions = [
  ["footer_link_privacy", "/privacy"],
  ["footer_link_terms", "/terms"],
] as const;

export const createSharedFooterProps = ({
  content,
  locale,
  editAttributes,
}: FooterNavigationOptions) => {
  const groups = footerGroupDefinitions.map(({ labelField, links }) => ({
    label: content[labelField],
    labelEditAttributes: editAttributes(labelField),
    links: links.map(([field, path]) => ({
      label: content[field],
      href: localizePath(path, locale),
      editAttributes: editAttributes(field),
    })),
  }));
  const legalLinks = footerLegalDefinitions.map(([field, path]) => ({
    label: content[field],
    href: localizePath(path, locale),
    editAttributes: editAttributes(field),
  }));

  return {
    brandLabel: content.footer_brand_name,
    brandHref: localizePath("/", locale),
    description: content.footer_about,
    groups,
    legalLinks,
    copyrightText: content.footer_copyright,
    navigationLabel: content.footer_navigation_label,
    legalNavigationLabel: content.footer_legal_navigation_label,
    brandEditAttributes: editAttributes("footer_brand_name"),
    descriptionEditAttributes: editAttributes("footer_about"),
    copyrightEditAttributes: editAttributes("footer_copyright"),
  };
};
