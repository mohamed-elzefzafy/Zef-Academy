"use client";
import {
  Box,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { use, useState } from "react";
import {
  useGetOneUserQuery,
  useLogoutMutation,
} from "@/redux/slices/api/authApiSlice";
import { useRouter } from "next/navigation";
import { useDeleteCurrentUserMutation } from "@/redux/slices/api/userApiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import CoursesComponent from "../../(home)/_componens/CoursesComponent";
import { ICourse } from "@/types/course";
import {
  useDeleteCourseAdminInstructorPageMutation,
  useGetCoursesQuery,
} from "@/redux/slices/api/courseApiSlice";
import swal from "sweetalert";
import { Delete, Edit } from "@mui/icons-material";
import Loading from "@/app/loading";

const ProfilePage = ({ params }: { params: Promise<{ userId: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const [deleteCourseAdminInstructorPage] =
    useDeleteCourseAdminInstructorPageMutation();
  const [deleteCurrentUser] = useDeleteCurrentUserMutation();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state?.auth);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: courseResponse,
    refetch,
    isLoading: loadingCourse,
  } = useGetCoursesQuery(`?page=${currentPage}&user=${resolvedParams.userId}`);

  const { data: user } = useGetOneUserQuery(resolvedParams.userId);
  console.log("user", user);

  let filterdCourses;
  if (!loadingCourse) {
    filterdCourses = courseResponse?.courses.filter(
      (course) => course.instructor._id === user?._id
    );
  }

  const onDeleteCurrentUser = async () => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure you want to delete your account?",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteCurrentUser({}).unwrap();
        await logout({}).unwrap();
        dispatch(logoutAction());
        router.push("/");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete account";
      toast.error(errorMessage);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <Container sx={{ alignItems: "center", justifyContent: "center" }}>
      <Stack
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          py: 5,
          minHeight: "calc(100vh - 68.5px)",
        }}
      >
        {/* <SearchParamComponent returnPath="/admin-dashboard/users" /> */}
        {user?.profileImage?.url ? (
          <Box
            sx={{
              width: { xs: "100%", md: 1000 },
              height: { xs: 300, md: 500 },
              position: "relative",
              marginTop: 2,
            }}
          >
            <Image
              src={user.profileImage?.url}
              alt={user.firstName}
              fill
              style={{ borderRadius: 10, objectFit: "contain" }}
            />
          </Box>
        ) : (
          <Box sx={{ my: 5 }}></Box>
        )}

        <Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: { xs: "flex-start", sm: "center" },
              width: "100%",
              gap: { xs: 1, md: 2 },
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px" },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                name :
              </Typography>{" "}
              {user?.firstName + " " + user?.lastName}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px" },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                email :
              </Typography>{" "}
              {user?.email}
            </Typography>
          </Box>

          {/* Since & Role */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: { xs: "flex-start", sm: "center" },
              width: "100%",
              gap: { xs: 1, md: 2 },
              mt: 2,
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                Since
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  fontWeight: "bold",
                  color: "secondary.main",
                }}
              >
                : {user?.createdAt.substring(0, 10)}
              </Typography>
            </Stack>

            {user?.role !== "user" && (
              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "16px", md: "20px" },
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  role :
                </Typography>{" "}
                {user?.role}
              </Typography>
            )}
          </Box>
        </Stack>

        {userInfo._id === user?._id && (
          <Stack
            direction={"row"}
            sx={{
              my: 3,
              border: "1px solid  grey",
              borderRadius: 2,
              padding: 1,
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip
              title="delete profile"
              placement="left"
              key={"delete-profile"}
            >
              <IconButton onClick={onDeleteCurrentUser}>
                {" "}
                <Delete color="error" sx={{ fontSize: "25" }} />{" "}
              </IconButton>
            </Tooltip>

            <Tooltip
              title="edit profile"
              placement="right"
              key={"edit-profile"}
            >
              <IconButton
                onClick={() => router.push(`/edit-user/${user?._id}`)}
              >
                {" "}
                <Edit color="primary" sx={{ fontSize: "25" }} />{" "}
              </IconButton>
            </Tooltip>
          </Stack>
        )}

        {user.role === "instructor" && (
          <>
            <Typography
              variant="h6"
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              {courseResponse?.courses && courseResponse?.courses?.length < 1
                ? "No courses for this instructor"
                : `${user?.firstName} courses : `}
            </Typography>
            <Stack sx={{ width: "100%" }}>
              {courseResponse && (
                <CoursesComponent
                  pagination={courseResponse?.pagination}
                  courses={filterdCourses as ICourse[]}
                  refetchPosts={refetch}
                  setCurrentPage={setCurrentPage}
                  page={currentPage}
                  userId={resolvedParams.userId}
                  deleteCourse={(args) => {
                    const { _id, page, userId } = args;
                    if (typeof userId !== "string") return;
                    deleteCourseAdminInstructorPage({ _id, page });
                  }}
                  loadingCourse={loadingCourse}
                />
              )}
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default ProfilePage;
