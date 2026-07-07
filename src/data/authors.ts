export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  expertise: string[];
};

export const authors: Author[] = [
  {
    slug: "michael-torres",
    name: "Michael Torres",
    role: "Lead RV Warranty Analyst",
    bio: "Michael has spent 15 years in the RV industry as a service advisor and extended warranty consultant. He has personally reviewed warranty contracts from more than 20 providers and conducted secret-shopper evaluations for RV Warranty Review since 2024.",
    credentials: [
      "15 years RV service and warranty experience",
      "Certified RV Service Technician (RVIA)",
      "Conducted 40+ secret-shopper warranty evaluations",
    ],
    expertise: [
      "RV extended warranty contracts",
      "Claims processing and repair facility relations",
      "Motorhome and towable coverage analysis",
    ],
  },
  {
    slug: "jennifer-walsh",
    name: "Jennifer Walsh",
    role: "Senior Research Editor",
    bio: "Jennifer brings a decade of consumer finance and insurance research experience to RV Warranty Review. She verifies provider insurance backing, BBB accreditation, and regulatory compliance for every company we rate.",
    credentials: [
      "10 years consumer finance research",
      "Former insurance product comparison editor",
      "BBB and NAIC regulatory research specialist",
    ],
    expertise: [
      "Insurance-backed service contracts",
      "Provider transparency and disclosure",
      "Pricing and total cost of ownership analysis",
    ],
  },
];

export const defaultAuthor = authors[0];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorOrDefault(slug?: string): Author {
  return getAuthor(slug ?? defaultAuthor.slug) ?? defaultAuthor;
}
