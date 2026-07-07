"use client";

import { useEffect, useMemo, useState } from "react";
import type { UserReview } from "@/types/user-review";
import { Rating } from "./Rating";

const RV_TYPES = [
  "Motorhome",
  "Travel Trailer",
  "Fifth Wheel",
  "Toy Hauler",
  "Other",
];

type UserReviewFormProps = {
  companySlug: string;
  companyName: string;
  onSubmitted: (review: UserReview) => void;
};

export function UserReviewForm({
  companySlug,
  companyName,
  onSubmitted,
}: UserReviewFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(8);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rvType, setRvType] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companySlug,
          authorName,
          rating,
          title,
          body,
          rvType,
          website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      onSubmitted(data.review);
      setSuccess(true);
      setTitle("");
      setBody("");
      setRvType("");
      setWebsite("");
    } catch {
      setError("Unable to submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand/5 p-6">
        <p className="font-semibold text-foreground">Thank you for your review!</p>
        <p className="mt-2 text-sm text-muted">
          Your feedback for {companyName} has been published. It helps other RV
          owners make better warranty decisions.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm font-semibold text-brand hover:underline"
        >
          Submit another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-foreground">
            Your name *
          </label>
          <input
            id="authorName"
            type="text"
            required
            minLength={2}
            maxLength={80}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="First name or initials"
          />
        </div>

        <div>
          <label htmlFor="rvType" className="block text-sm font-medium text-foreground">
            RV type
          </label>
          <select
            id="rvType"
            value={rvType}
            onChange={(e) => setRvType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Select RV type (optional)</option>
            {RV_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-foreground">
          Your rating *
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <input
            id="rating"
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full max-w-xs accent-brand"
          />
          <Rating score={rating} size="md" />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground">
          Review headline
        </label>
        <input
          id="title"
          type="text"
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          placeholder="Summarize your experience"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-foreground">
          Your review *
        </label>
        <textarea
          id="body"
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          placeholder="What was your experience with claims, coverage, or customer service?"
        />
        <p className="mt-1 text-xs text-muted">{body.length}/2000 characters</p>
      </div>

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <p className="text-xs text-muted">
        By submitting, you agree that your review may be published on{" "}
        {companyName}&apos;s review page. We may remove reviews that violate our
        guidelines.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

function formatReviewDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type UserReviewListProps = {
  reviews: UserReview[];
};

export function UserReviewList({ reviews }: UserReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted">
        No owner reviews yet. Be the first to share your experience.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{review.authorName}</p>
              <p className="text-xs text-muted">
                {review.rvType ? `${review.rvType} owner · ` : ""}
                {formatReviewDate(review.createdAt)}
              </p>
            </div>
            <Rating score={review.rating} size="sm" />
          </div>
          {review.title && (
            <h3 className="mt-3 font-medium text-foreground">{review.title}</h3>
          )}
          <p className="mt-2 text-sm leading-relaxed text-muted">{review.body}</p>
        </article>
      ))}
    </div>
  );
}

type UserReviewSectionProps = {
  companySlug: string;
  companyName: string;
  initialReviews: UserReview[];
  averageRating: number;
};

export function UserReviewSection({
  companySlug,
  companyName,
  initialReviews,
  averageRating: initialAverage,
}: UserReviewSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    fetch(`/api/reviews?companySlug=${encodeURIComponent(companySlug)}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, [companySlug]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return initialAverage;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews, initialAverage]);

  return (
    <section id="owner-reviews" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Owner Reviews
          </h2>
          <p className="mt-2 text-sm text-muted">
            Real experiences from RV owners who have used {companyName}.
            {reviews.length > 0 &&
              ` Average owner rating: ${averageRating}/10 from ${reviews.length} review${reviews.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <a
          href="#leave-review"
          className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          Leave a Review
        </a>
      </div>

      <div className="mt-6">
        <UserReviewList reviews={reviews} />
      </div>

      <div
        id="leave-review"
        className="mt-8 scroll-mt-24 rounded-xl border border-border bg-background p-6"
      >
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Leave Your Review
        </h3>
        <p className="mt-2 text-sm text-muted">
          Share your experience with {companyName} to help other RV owners.
        </p>
        <div className="mt-5">
          <UserReviewForm
            companySlug={companySlug}
            companyName={companyName}
            onSubmitted={(review) =>
              setReviews((current) => [review, ...current])
            }
          />
        </div>
      </div>
    </section>
  );
}
