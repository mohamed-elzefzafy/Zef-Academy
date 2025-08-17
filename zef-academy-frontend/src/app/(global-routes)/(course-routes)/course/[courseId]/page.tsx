// "use client";
// import CourseContent from "./_components/CourseContent";
// import { use } from "react";
// import { useGetOneCourseQuery } from "@/redux/slices/api/courseApiSlice";
// import Loading from "@/app/loading";


// const CoursePage =  ({
//   params,
// }: {
//   params: Promise<{ courseId: string }>;
// }) => {
//   const resolvedParams = use(params);


//   const {data : course , isLoading} = useGetOneCourseQuery(resolvedParams.courseId);

//  if (isLoading) {
//   return <Loading/>
//  }

//   if (!course) {
//   return 
//  }

//   return <CourseContent course={course} />;
// };

// export default CoursePage;



// "use client";

// import CourseContent from "./_components/CourseContent";
// import { useGetOneCourseQuery } from "@/redux/slices/api/courseApiSlice";
// import Loading from "@/app/loading";

// type CoursePageProps = {
//   params: { courseId: string };
// };

// const CoursePage = ({ params }: CoursePageProps) => {
//   const { data: course, isLoading } = useGetOneCourseQuery(params.courseId);

//   if (isLoading) {
//     return <Loading />;
//   }

//   if (!course) {
//     return <div>Course not found</div>;
//   }

//   return <CourseContent course={course} />;
// };

// export default CoursePage;







// "use client";
// import CourseContent from "./_components/CourseContent";
// import { useGetOneCourseQuery } from "@/redux/slices/api/courseApiSlice";
// import Loading from "@/app/loading";

// const CoursePage = ({ params }: { params: { courseId: string } }) => {
//   const { data: course, isLoading } = useGetOneCourseQuery(params.courseId);

//   if (isLoading) {
//     return <Loading />;
//   }

//   if (!course) {
//     return <div>Course not found</div>;
//   }

//   return <CourseContent course={course} />;
// };

// export default CoursePage;




"use client";

import CourseContent from "./_components/CourseContent";
import { use } from "react";
import { useGetOneCourseQuery } from "@/redux/slices/api/courseApiSlice";
import Loading from "@/app/loading";

const CoursePage = ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  // نفك الـ Promise بتاع params
  const resolvedParams = use(params);

  const { data: course, isLoading } = useGetOneCourseQuery(
    resolvedParams.courseId
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return <CourseContent course={course} />;
};

export default CoursePage;
