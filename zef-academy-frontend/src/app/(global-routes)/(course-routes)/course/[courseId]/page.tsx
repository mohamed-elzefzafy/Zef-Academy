import axiosRequest from "@/utils/request";
import { ICourse } from "@/types/course";
import CourseContent from "./_components/CourseContent";

const PostPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  if (!(await params).courseId) return;
  const { data: course } = await axiosRequest.get<ICourse>(
    `/api/v1/course/${(await params).courseId}`
  );

  console.log(course);

  return <CourseContent course={course} />;
};

export default PostPage;
