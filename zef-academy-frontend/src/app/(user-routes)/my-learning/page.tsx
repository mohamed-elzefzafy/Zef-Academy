"use client";
import CoursesComponent from "@/app/(global-routes)/(home)/_componens/CoursesComponent";
import Loading from "@/app/loading";
import { useAppSelector } from "@/redux/hooks";
import { useGetMyLearningCourseQuery } from "@/redux/slices/api/courseApiSlice"
import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";

const MyLearningCourses = () => {
  const {data : myLeaningCourses , isLoading} = useGetMyLearningCourseQuery();
     const { userInfo } = useAppSelector((state) => state?.auth);
    const [currentPage, setCurrentPage] = useState(1);
  console.log(myLeaningCourses);
  

    if (isLoading) {
    return <Loading/>
  }

  return (
      <Container sx={{ textAlign: "center", pt: 3 }}>
      {myLeaningCourses?.courses && myLeaningCourses?.courses.length > 0 ? (
        <Typography sx={{ my: 5 }} variant="h4">
          My Learning
        </Typography>
      ) : (
        <Typography sx={{ my: 5 }} variant="h4">
        You don&apos;t have learning courses
        </Typography>
      )}
      {myLeaningCourses && (
        <CoursesComponent
          courses={myLeaningCourses?.courses}
          pagination={myLeaningCourses.pagination}
          refetchCourses={()=>{}}
          setCurrentPage={setCurrentPage}
          page={currentPage}
          search={""}
          deleteCourse={() => {}}
          loadingCourse={isLoading}
        />
      )}

      
    </Container>
  )
}

export default MyLearningCourses