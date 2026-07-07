type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-foreground">
        Frequently Asked Questions
      </h2>
      <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((item) => (
          <details key={item.question} className="group p-5">
            <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <svg
                  className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export const homepageFaqs = [
  {
    question: "What is an RV extended warranty?",
    answer:
      "An RV extended warranty, also called a vehicle service contract, covers repair costs when your RV's systems and appliances suffer mechanical failure. It applies to motorhomes, travel trailers, fifth wheels, and other RV types at licensed repair facilities across the US and Canada.",
  },
  {
    question: "Is an RV extended warranty the same as RV insurance?",
    answer:
      "No. Extended warranties cover mechanical breakdowns — like a failed AC compressor or transmission. RV insurance covers damage from accidents, weather, theft, and liability. You typically need both for complete protection.",
  },
  {
    question: "How much does an RV extended warranty cost?",
    answer:
      "Costs vary by RV type, age, mileage, coverage level, and term length. Powertrain plans may start around $1,000–$2,500, while comprehensive motorhome coverage can exceed $4,000–$8,000. Get quotes from multiple providers to compare.",
  },
  {
    question: "What is the best RV extended warranty company?",
    answer:
      "Based on our research, America's RV Warranty ranks highest for overall coverage, mobile mechanic support, and claims handling. Good Sam ESP and Wholesale Warranties are also strong options depending on your priorities and budget.",
  },
];
