import { IUserInfo } from "./auth";

export interface IReview {
  _id: string;
  comment: string;
  rating: number;
  user: IUserInfo; 
  course: string;
  createdAt: string;
  updatedAt: string;
}
