export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewText: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt?: Date;
}
