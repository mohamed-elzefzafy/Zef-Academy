"use client";
import CoursesComponent from "@/app/(global-routes)/(home)/_componens/CoursesComponent";
import Loading from "@/app/loading";
import { useAppSelector } from "@/redux/hooks";
import { useGetMyWishlistQuery } from "@/redux/slices/api/wislistApiSlice";
import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const MyWishlistPage = () => {
    const { userInfo } = useAppSelector((state) => state?.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: wishlistResponse,
    isLoading,
    refetch,
  } = useGetMyWishlistQuery();

    useEffect(()=>{
  refetch();
  },[refetch , userInfo?.wishlist])

  if (isLoading) {
    return <Loading/>
  }

  return (
    <Container sx={{ textAlign: "center", pt: 3 }}>
      {wishlistResponse?.wishlist && wishlistResponse?.wishlist.length > 0 ? (
        <Typography sx={{ my: 5 }} variant="h4">
          My Wishlist
        </Typography>
      ) : (
        <Typography sx={{ my: 5 }} variant="h4">
        You don&apos;t have wishlist courses
        </Typography>
      )}
      {wishlistResponse && (
        <CoursesComponent
          courses={wishlistResponse.wishlist}
          pagination={wishlistResponse.pagination}
          refetchCourses={()=>{}}
          setCurrentPage={setCurrentPage}
          page={currentPage}
          search={""}
          deleteCourse={() => {}}
          loadingCourse={isLoading}
        />
      )}
    </Container>
  );
};

export default MyWishlistPage;
