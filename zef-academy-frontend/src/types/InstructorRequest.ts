// export interface ICurrentUserInstructorRequest {
//   requestStatueTitle: string;
//   image : CloudinaryObject;

// }
// export interface IAddCategory {
//   title: string;
//   image : CloudinaryObject;
// }

export interface ICurrentUserInstructorRequest {
  _id: string;
  requestStatueTitle: string;
  createdAt: string;
  updatedAt: string;
  user: string;
}
