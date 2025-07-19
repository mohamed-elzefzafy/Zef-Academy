import { CloudinaryObject, IUserInfo } from "./auth";
import { ICategory } from "./category";


export interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: CloudinaryObject;
  category: ICategory;
  sold: number;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  isPublished: boolean;
  isFree: boolean;
  reviewsNumber: number;
  instructor: IUserInfo;
  users: string[];
  videosLength :string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseResponse {
  courses: ICourse[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pagesCount: number;
}
