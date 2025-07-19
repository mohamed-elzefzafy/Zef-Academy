import { CloudinaryObject } from "./auth";
import { Pagination } from "./course";

export interface ICategoryResponse {
  categories: ICategory[] ;
  pagination: Pagination;
}

export interface ICategory {
  _id: string;
  title: string;
  image : CloudinaryObject;
  createdAt: string;
  updatedAt: string;
}
export interface IAddCategory {
  title: string;
  image : CloudinaryObject;
}



