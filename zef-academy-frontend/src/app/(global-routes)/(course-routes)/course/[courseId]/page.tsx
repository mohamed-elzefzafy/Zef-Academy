"use client";
import CourseContent from "./_components/CourseContent";
import { use } from "react";
import { useGetOneCourseQuery } from "@/redux/slices/api/courseApiSlice";
import Loading from "@/app/loading";


const CoursePage =  ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const resolvedParams = use(params);


  const {data : course , isLoading} = useGetOneCourseQuery(resolvedParams.courseId);

 if (isLoading) {
  return <Loading/>
 }

  if (!course) {
  return 
 }

  return <CourseContent course={course} />;
};

export default CoursePage;



