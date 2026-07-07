import type { CompanyReview } from "@/types";

export const companies: CompanyReview[] = [
  {
    slug: "americas-rv-warranty",
    name: "America's RV Warranty",
    rank: 1,
    rating: 9.0,
    reviewCount: 1245,
    badge: "Best Overall 2026",
    summary:
      "America's RV Warranty offers top-tier extended warranties with excellent customer service and comprehensive repair coverage, including mobile mechanic services.",
    pros: [
      "Exclusive mobile mechanic support with fast, convenient repairs",
      "In-house claims professionals with no third parties",
      "Coverage for brand new parts and diagnostic fees",
      "Backed by A-rated insurance and BBB accreditation",
    ],
    cons: [
      "Premiums can be higher than budget providers",
      "Some add-ons increase total plan cost",
    ],
    highlights: [
      "Leading provider of RV extended warranties",
      "Mobile mechanic support nationwide",
      "In-house claims department",
      "A-rated insurance backing",
    ],
    testimonials: [
      {
        quote:
          "This company has been awesome to work with. They are very timely in getting back to you.",
        source: "BBB Review",
      },
      {
        quote:
          "They pay claims quickly, and repair shops like working with them.",
        source: "BBB Review",
      },
    ],
    verdict:
      "If you want real-world usability, strong mobile support, and excellent customer service, America's RV Warranty remains a top-tier choice. The peace of mind knowing you can use a mobile tech anywhere in the country makes ARW stand out in a crowded field.",
    coverageType: "Extended Service Contract",
    deductible: "$0–$1,000",
    eligibility: "Up to 20 years (no inspection for RVs under 20 yrs)",
    ctaUrl:
      "https://www.americasrvwarranty.com/quote/source/rvr/tracking_num/770-727-0028",
    ctaLabel: "Get Quote",
    publishedAt: "2025-10-01",
    updatedAt: "2026-03-01",
    reviewedBy: "michael-torres",
  },
  {
    slug: "good-sam-esp",
    name: "Good Sam ESP",
    rank: 2,
    rating: 8.0,
    reviewCount: 1023,
    summary:
      "Good Sam ESP, owned by Camping World, offers RV warranties with major repair coverage, known for brand reliability despite mixed reviews on claim denials.",
    pros: [
      "Mechanical breakdown insurance backed by A+ rated underwriter",
      "Coverage available in all 50 states and Canada",
      "Plans are fully transferable at no cost",
      "Travel expense reimbursement for food, lodging, and rental car",
    ],
    cons: [
      "No roadside benefits included with base coverage",
      "Mixed reputation on claim denials",
      "Requires Good Sam Club membership",
    ],
    highlights: [
      "Flexible payment options",
      "Nationwide coverage",
      "Fully transferable plans",
      "Travel expense reimbursement",
    ],
    testimonials: [
      {
        quote: "This plan paid for itself. Worth it.",
        source: "Good Sam Community",
      },
      {
        quote: "Claims denied due to rust on cooling tubes.",
        source: "Good Sam Community",
      },
    ],
    verdict:
      "Good Sam ESP remains a solid option for RVers looking for nationwide protection and insurance-backed security. It's particularly attractive for full-time travelers, but review exclusions carefully before committing.",
    coverageType: "Mechanical Breakdown Insurance",
    deductible: "$100–$500",
    eligibility: "Up to 15 years / 100k+ miles",
    publishedAt: "2025-10-05",
    updatedAt: "2026-03-01",
    reviewedBy: "michael-torres",
  },
  {
    slug: "roamly",
    name: "Roamly",
    rank: 3,
    rating: 7.6,
    reviewCount: 512,
    summary:
      "Roamly connects RV owners with warranty providers, offering easy quotes but inconsistent claim handling depending on the underlying administrator.",
    pros: [
      "Quick online quotes and easy plan comparison",
      "Modern digital-first experience",
      "Multiple plan options from partner providers",
    ],
    cons: [
      "Acts as a broker — claim experience varies by provider",
      "Less direct control over claims process",
      "Customer service quality can be inconsistent",
    ],
    highlights: [
      "Fast online quoting",
      "Compare multiple providers",
      "Digital-first platform",
    ],
    testimonials: [
      {
        quote: "Quick quotes and easy to compare plans.",
        source: "Google Review",
      },
      {
        quote: "Claim issues because of the provider they chose.",
        source: "Facebook Review",
      },
    ],
    verdict:
      "Roamly is a convenient starting point for comparing options, but understand you're working with a broker. Verify which administrator backs your specific plan before purchasing.",
    coverageType: "Broker / Multiple Providers",
    deductible: "Varies by plan",
    eligibility: "Varies by provider",
    publishedAt: "2025-10-10",
    updatedAt: "2026-02-15",
    reviewedBy: "jennifer-walsh",
  },
  {
    slug: "wholesale-warranties",
    name: "Wholesale Warranties",
    rank: 4,
    rating: 7.0,
    reviewCount: 987,
    summary:
      "Wholesale Warranties offers flexible RV warranties with a user-friendly online quote system and competitive pricing, though claim processing can be slow.",
    pros: [
      "User-friendly online quote system",
      "Competitive pricing on many plan tiers",
      "Flexible coverage options",
    ],
    cons: [
      "Claim processing can be slow",
      "Transfer fees may apply on some plans",
      "Mixed customer service reviews",
    ],
    highlights: [
      "Online quote system",
      "Competitive pricing",
      "Flexible plan options",
    ],
    testimonials: [
      {
        quote: "They are fair and easy to work with and I recommend them.",
        source: "BBB Review",
      },
      {
        quote: "They take forever to approve claims. I am canceling his policy.",
        source: "BBB Review",
      },
    ],
    verdict:
      "Wholesale Warranties can be a good value if price is your top priority. Just be prepared for a potentially slower claims process and read your contract carefully.",
    coverageType: "Extended Service Contract",
    deductible: "$100–$250",
    eligibility: "Up to 20 years (varies)",
    publishedAt: "2025-10-12",
    updatedAt: "2026-02-20",
    reviewedBy: "michael-torres",
  },
  {
    slug: "rv-complete",
    name: "RV Complete",
    rank: 5,
    rating: 6.0,
    reviewCount: 432,
    summary:
      "RV Complete acts primarily as a dispatch service rather than a full warranty provider, with negative reviews citing poor service and claim denials.",
    pros: [
      "Can help connect you with mobile repair services",
      "Lower entry price point than full warranties",
    ],
    cons: [
      "Not a traditional warranty provider",
      "Many reports of claim denials",
      "Limited coverage compared to full service contracts",
    ],
    highlights: [
      "Dispatch and repair coordination",
      "Lower upfront cost",
    ],
    testimonials: [
      {
        quote: "RV Complete is NOT a warranty provider, just a dispatch service.",
        source: "Reddit Review",
      },
      {
        quote: "Biggest ripoff. They won't cover anything.",
        source: "Reddit Review",
      },
    ],
    verdict:
      "Understand what you're buying. RV Complete is not equivalent to a full extended warranty and may not provide the coverage most RV owners expect.",
    coverageType: "Dispatch Service",
    deductible: "Varies",
    eligibility: "Limited",
    publishedAt: "2025-10-15",
    updatedAt: "2026-01-20",
    reviewedBy: "jennifer-walsh",
  },
  {
    slug: "warranty-direct-protect",
    name: "Warranty Direct Protect",
    rank: 6,
    rating: 5.5,
    reviewCount: 876,
    summary:
      "Warranty Direct Protect, formerly Eagle Vision, offers comprehensive RV warranties with improved customer service, though premiums can be high.",
    pros: [
      "Comprehensive coverage options",
      "Improved customer service in recent years",
      "Fast claim approval reported by some customers",
    ],
    cons: [
      "Premiums can be steep",
      "Less brand recognition than top competitors",
    ],
    highlights: [
      "Comprehensive plans",
      "Improved service track record",
      "Multiple coverage tiers",
    ],
    testimonials: [
      {
        quote: "Fast claim approval for my RV's fridge repair.",
        source: "Google Review",
      },
      {
        quote: "Premiums are steep, but coverage is worth it.",
        source: "Facebook Review",
      },
    ],
    verdict:
      "Warranty Direct Protect offers solid coverage if you're willing to pay premium prices. Compare quotes against top-rated providers before deciding.",
    coverageType: "Extended Service Contract",
    deductible: "$100–$250",
    eligibility: "Up to 15 years",
    publishedAt: "2025-10-18",
    updatedAt: "2026-02-01",
    reviewedBy: "michael-torres",
  },
  {
    slug: "easycare-rv",
    name: "EasyCare RV",
    rank: 7,
    rating: 5.0,
    reviewCount: 543,
    summary:
      "EasyCare RV provides warranties through dealerships, covering major components, with mixed reviews on claim ease and policy exclusions.",
    pros: [
      "Available through many RV dealerships nationwide",
      "Covers major coach and drivetrain components",
      "Straightforward claim process reported by some owners",
    ],
    cons: [
      "Must typically purchase through a dealer, limiting price comparison",
      "Many exclusions buried in contract fine print",
      "Mixed reviews on claim approval speed",
    ],
    highlights: [
      "Dealership-based enrollment",
      "Major component coverage",
      "Established administrator network",
    ],
    testimonials: [
      {
        quote: "Claim process was straightforward for my slide-out repair.",
        source: "Google Review",
      },
      {
        quote: "Too many exclusions in the policy.",
        source: "Facebook Review",
      },
    ],
    verdict:
      "EasyCare RV can work if your dealer offers a competitive rate, but compare against direct providers before signing at the F&I desk. Dealer-sold contracts often cost more than buying directly.",
    coverageType: "Extended Service Contract",
    deductible: "$100–$200",
    eligibility: "Up to 12 years (varies by dealer)",
    publishedAt: "2025-11-01",
    updatedAt: "2026-03-01",
    reviewedBy: "michael-torres",
  },
  {
    slug: "american-guardian",
    name: "American Guardian",
    rank: 8,
    rating: 4.5,
    reviewCount: 321,
    summary:
      "American Guardian offers affordable RV warranties with coverage for essential systems, though some owners report claim denials and slow response times.",
    pros: [
      "Lower premiums than top-tier providers",
      "Covers essential RV systems on budget plans",
      "Quick initial response on quotes",
    ],
    cons: [
      "Frequent reports of claim denials",
      "Limited coverage compared to exclusionary plans",
      "Less transparent about administrator backing",
    ],
    highlights: [
      "Budget-friendly pricing",
      "Essential systems coverage",
      "Quick quote turnaround",
    ],
    testimonials: [
      {
        quote: "Good coverage for the price, quick response.",
        source: "Google Review",
      },
      {
        quote: "Claim denied for unclear reasons.",
        source: "Facebook Review",
      },
    ],
    verdict:
      "American Guardian may suit budget-conscious owners willing to accept higher claim risk. We recommend comparing against higher-rated providers with stronger claims reputations before choosing on price alone.",
    coverageType: "Extended Service Contract",
    deductible: "$100–$250",
    eligibility: "Up to 15 years",
    publishedAt: "2025-11-05",
    updatedAt: "2026-02-28",
    reviewedBy: "jennifer-walsh",
  },
  {
    slug: "warranty-forever-rv",
    name: "Warranty Forever RV",
    rank: 9,
    rating: 4.0,
    reviewCount: 298,
    summary:
      "Warranty Forever RV offers lifetime coverage through dealerships, but restrictive terms and maintenance requirements lead to frequent claim denials.",
    pros: [
      "Lifetime coverage marketing appeals to long-term owners",
      "Sold through dealer networks with bundled enrollment",
      "Covers major components when claims are approved",
    ],
    cons: [
      "Strict maintenance documentation requirements",
      "High rate of claim denials reported online",
      "Lifetime terms include significant restrictions",
    ],
    highlights: [
      "Lifetime coverage option",
      "Dealership enrollment",
      "Major component protection",
    ],
    testimonials: [
      {
        quote: "Lifetime warranty sounds great, but too many restrictions.",
        source: "Google Review",
      },
      {
        quote: "Claim denied due to maintenance issues.",
        source: "Facebook Review",
      },
    ],
    verdict:
      "The 'lifetime' label is misleading for many owners. Strict maintenance rules and denial patterns make Warranty Forever RV difficult to recommend unless you thoroughly understand every contract requirement.",
    coverageType: "Extended Service Contract",
    deductible: "$0–$100",
    eligibility: "New and used RVs via dealers",
    publishedAt: "2025-11-08",
    updatedAt: "2026-03-01",
    reviewedBy: "michael-torres",
  },
];

export function getCompany(slug: string): CompanyReview | undefined {
  return companies.find((c) => c.slug === slug);
}

export function getCompaniesSorted(): CompanyReview[] {
  return [...companies].sort((a, b) => a.rank - b.rank);
}
