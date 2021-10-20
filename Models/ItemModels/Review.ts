export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
