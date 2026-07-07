import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { CreateUserReviewInput, UserReview } from "@/types/user-review";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "user-reviews.json");

function ensureStore(): UserReview[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as UserReview[];
  } catch {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return [];
  }
}

function saveStore(reviews: UserReview[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

function sortNewestFirst(reviews: UserReview[]) {
  return [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUserReviews(companySlug?: string): UserReview[] {
  const reviews = ensureStore().filter((r) => r.status === "approved");
  if (companySlug) {
    return sortNewestFirst(reviews.filter((r) => r.companySlug === companySlug));
  }
  return sortNewestFirst(reviews);
}

export function getUserReviewStats(companySlug: string) {
  const reviews = getUserReviews(companySlug);
  if (reviews.length === 0) {
    return { count: 0, average: 0 };
  }

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return {
    count: reviews.length,
    average: Math.round(average * 10) / 10,
  };
}

export function createUserReview(input: CreateUserReviewInput): UserReview {
  const reviews = ensureStore();
  const review: UserReview = {
    id: randomUUID(),
    companySlug: input.companySlug,
    authorName: input.authorName.trim(),
    rating: input.rating,
    title: input.title?.trim() || undefined,
    body: input.body.trim(),
    rvType: input.rvType?.trim() || undefined,
    createdAt: new Date().toISOString(),
    status: "approved",
  };

  reviews.push(review);
  saveStore(reviews);
  return review;
}
