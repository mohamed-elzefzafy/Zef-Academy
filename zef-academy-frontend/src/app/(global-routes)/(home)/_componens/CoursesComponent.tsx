import { Box, Grid } from "@mui/material";
import { ChangeEvent } from "react";
import { ICourse, Pagination } from "@/types/course";
import PaginationComponent from "@/app/components/PaginationComponent";
import CourseCard from "./CourseCard";
import Loading from "@/app/loading";

const CoursesComponent = ({
  courses,
  pagination,
  refetchCourses,
  setCurrentPage,
  page,
  search,
  category,
  userId,
  deleteCourse,
loadingCourse
}: {
  courses: ICourse[];
  pagination: Pagination;
  refetchCourses: () => void;
  setCurrentPage: (page: number) => void;
  page: number;
  search?: string;
  category?: string;
  userId?: string;
      loadingCourse :boolean,
  deleteCourse: (args: {
    _id: string;
    page?: number;
    search?: string;
    category?: string;
    userId?: string;
  }) => void;
}) => {
  const handlePageChange = (e: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loadingCourse) {
    return <Loading/>
  }

  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{ mt: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}
        flexWrap={"wrap"}
        justifyContent="center"
        alignItems="flex-start"
      >
        {courses?.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            refetchCourses={refetchCourses}
            page={page}
            search={search}
            category={category}
            userId={userId}
            deleteCourse={deleteCourse}
            users={course.users}
          />
        ))}
      </Grid>

      {pagination && pagination.pagesCount > 1 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <PaginationComponent
            count={pagination.pagesCount}
            currentPage={pagination.page}
            handlePageChange={handlePageChange}
          />
        </Box>
      )}
    </>
  );
};

export default CoursesComponent;
