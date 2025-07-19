

export interface ILecture {
  _id: string;
  title: string;
  videoUrl: CloudinaryObjectVideo;
  position: number;
  isFree: boolean;
  course: string;
  attachments: CloudinaryObjectPdf[];
  createdAt: string;
  updatedAt: string;
}

export interface ILectureResponse {
  lectures: ILecture[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pagesCount: number;
}

export type CloudinaryObjectPdf = {
  url: string;
  public_id: string | null;
  originalName: string;
};

export type CloudinaryObjectVideo = {
  url: string;
  public_id: string | null;
  videoDuration: string;
  originalDuration: number;
};
