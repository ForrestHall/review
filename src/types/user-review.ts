export type UserReview = {
  id: string;
  companySlug: string;
  authorName: string;
  rating: number;
  title?: string;
  body: string;
  rvType?: string;
  createdAt: string;
  status: "approved" | "pending";
};

export type CreateUserReviewInput = {
  companySlug: string;
  authorName: string;
  rating: number;
  title?: string;
  body: string;
  rvType?: string;
};
