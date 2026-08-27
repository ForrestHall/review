import { FindCoverageLink } from "@/components/AttributionLinks";

type QuizMatchCtaProps = {
  /** Optional context for slightly varied supporting copy */
  variant?: "default" | "compare";
};

export function QuizMatchCta({ variant = "default" }: QuizMatchCtaProps) {
  const support =
    variant === "compare"
      ? "Still deciding between providers? Answer a few questions — about 60 seconds — and get matched to the best fit for your RV."
      : "Not sure which warranty fits? Answer a few questions — about 60 seconds — and get matched to the best coverage for your RV.";

  return (
    <section className="mt-10 rounded-xl border border-brand/20 bg-brand/5 p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-foreground">
        Get matched in about 60 seconds
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
        {support}
      </p>
      <FindCoverageLink className="mt-5 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
        Get Matched
      </FindCoverageLink>
    </section>
  );
}
