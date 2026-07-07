import { NextResponse } from "next/server";
import { getCompany } from "@/data/companies";
import { createUserReview, getUserReviews } from "@/lib/user-reviews";
import type { CreateUserReviewInput } from "@/types/user-review";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get("companySlug") ?? undefined;

  if (companySlug && !getCompany(companySlug)) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  const reviews = getUserReviews(companySlug);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  let body: CreateUserReviewInput & { website?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const company = getCompany(body.companySlug);
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  const authorName = body.authorName?.trim();
  const reviewBody = body.body?.trim();
  const rating = Number(body.rating);

  if (!authorName || authorName.length < 2) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 400 }
    );
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 10." },
      { status: 400 }
    );
  }

  if (!reviewBody || reviewBody.length < 20) {
    return NextResponse.json(
      { error: "Review must be at least 20 characters." },
      { status: 400 }
    );
  }

  if (reviewBody.length > 2000) {
    return NextResponse.json(
      { error: "Review must be 2,000 characters or less." },
      { status: 400 }
    );
  }

  const review = createUserReview({
    companySlug: body.companySlug,
    authorName,
    rating,
    title: body.title?.trim(),
    body: reviewBody,
    rvType: body.rvType?.trim(),
  });

  return NextResponse.json({ review }, { status: 201 });
}
