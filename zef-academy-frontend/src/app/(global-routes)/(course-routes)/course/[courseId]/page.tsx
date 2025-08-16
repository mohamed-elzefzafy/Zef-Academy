// import axiosRequest from "@/utils/request";
// import { ICourse } from "@/types/course";
// import CourseContent from "./_components/CourseContent";



// const CoursePage = async ({
//   params,
// }: {
//   params: { courseId: string };
// }) => {
//   if (!(await params).courseId) return;
//   const { data: course } = await axiosRequest.get<ICourse>(
//     `/api/v1/course/${(await params).courseId}`
//   );

//   console.log(course);

//   return <CourseContent course={course} />;
// };

// export default CoursePage;



// import axiosRequest from "@/utils/request";
// import { ICourse } from "@/types/course";
// import CourseContent from "./_components/CourseContent";

// const CoursePage = async ({ params }: { params: { courseId: string } }) => {
//   if (!params.courseId) return null;

//   const { data: course } = await axiosRequest.get<ICourse>(
//     `/api/v1/course/${params.courseId}`
//   );

//   console.log(course);

//   return <CourseContent course={course} />;
// };

// export default CoursePage;


// import axiosRequest from "@/utils/request";
// import { ICourse } from "@/types/course";
// import CourseContent from "./_components/CourseContent";
// import { PageProps } from "next"; // ✨ خد التايب الجاهز من Next.js

// const CoursePage = async ({ params }: PageProps<{ courseId: string }>) => {
//   if (!params?.courseId) return null;

//   const { data: course } = await axiosRequest.get<ICourse>(
//     `/api/v1/course/${params.courseId}`
//   );

//   return <CourseContent course={course} />;
// };

// export default CoursePage;



import { ICourse } from "@/types/course";
import axiosRequest from "@/utils/request";
import CourseContent from "./_components/CourseContent";

interface PageProps {
  params: { courseId: string };
}

const CoursePage = async ({ params }: PageProps) => {
  const { data: course } = await axiosRequest.get<ICourse>(
    `/api/v1/course/${params.courseId}`
  );

  return <CourseContent course={course} />;
};

export default CoursePage;
