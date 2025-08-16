"use client";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ICourse } from "@/types/course";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetOneUserQuery } from "@/redux/slices/api/authApiSlice";
import {
  useAddCourseToWishlistMutation,
  useRemoveCourseFromWishlistMutation,
} from "@/redux/slices/api/wislistApiSlice";
import toast from "react-hot-toast";
import { setCredentials } from "@/redux/slices/authSlice";
import { IUserInfo } from "@/types/auth";

interface CourseCardProps {
  course: ICourse;
  refetchCourses: () => void;
  page: number;
  search?: string;
  category?: string;
  userId?: string;
  users?: IUserInfo[];
  deleteCourse: (args: {
    _id: string;
    page?: number;
    search?: string;
    category?: string;
    userId?: string;
  }) => void;
}
export default function CourseCard({
  course: {
    title,
    description,
    thumbnail,
    category: courseCategory,
    _id,
    instructor,
    users,
  },
  refetchCourses,
}: CourseCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: user, refetch } = useGetOneUserQuery(userInfo._id);
  const [addCourseToWishlist] = useAddCourseToWishlistMutation();
  const [removeCourseFromWishlist] = useRemoveCourseFromWishlistMutation();

  console.log(users);

  // const onDeleteCourse = async () => {
  //   try {
  //     const willDelete = await swal({
  //       title: "Are you sure?",
  //       text: "Are you sure that you want to delete this Post?",
  //       icon: "warning",
  //       dangerMode: true,
  //     });

  //     if (willDelete) {
  //       await deleteCourse({
  //         _id,
  //         page,
  //         search,
  //         category,
  //         userId,
  //       });
  //       router.refresh();
  //       toast.success("Post deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error("Delete post error:", error);
  //     const errorMessage =
  //       (error as { data?: { message?: string } }).data?.message ||
  //       "Failed to delete post";
  //     toast.error(errorMessage);
  //   }
  // };

  const handleAddCourseToWishlist = async () => {
    try {
      const user = await addCourseToWishlist({ course: _id }).unwrap();
      router.refresh();
      dispatch(setCredentials({ ...user }));
      refetch();
    } catch (error) {
      console.error("add course to wishlist error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to add course to wishlist";
      toast.error(errorMessage);
    }
  };

  const handleRemoveCourseFromWishlist = async () => {
    try {
    const user =  await removeCourseFromWishlist(_id).unwrap();
      router.refresh();
      dispatch(setCredentials({ ...user }));
      refetch();
    } catch (error) {
      console.error("remove course from wishlist error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to remove course from wishlist";
      toast.error(errorMessage);
    }
  };
  return (
    <Grid size={{ xs: 12, lg: 6 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: { xs: "100%", sm: 600, md: 700, lg: 500 },
          width: "100%",
          height: { xs: 420, sm: 280 },
          wordBreak: "break-word",
          m: { xs: 0, sm: 1 },
          boxShadow: 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {thumbnail?.url ? (
          <CardMedia
            component="img"
            sx={{
              width: { xs: "100%", sm: 160, md: 180 },
              height: { xs: 150, sm: "auto" },
              objectFit: { xs: "cover", sm: "contain" },
            }}
            image={thumbnail.url}
            alt={title}
          />
        ) : (
          <Box
            sx={{
              width: { xs: "100%", sm: 160, md: 180 },
              height: { xs: 150, sm: 250 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: blue[100],
              p: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                color: "black",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              {title}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            p: { xs: 1, sm: 2 },
          }}
        >
          <CardContent sx={{ flex: 1 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 1,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              category : {courseCategory.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 1,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Instructor :{" "}
              <Link href={`/`}>
                {instructor?.firstName + " " + instructor?.lastName}
              </Link>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 1,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {description.slice(0, 50)}
              {description.length > 50 ? "..." : ""}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              flexWrap: "wrap",
              gap: 1,
              justifyContent: { xs: "center", sm: "space-between" },
            }}
          >
            <Button
              size="small"
              variant="text"
              sx={{ textTransform: "capitalize", fontWeight: "bold" }}
              color="secondary"
              onClick={() => router.push(`/course/${_id}`)}
            >
              read-more
            </Button>

            {(userInfo.role === "user" || userInfo.role === "instructor") &&
              user?._id !== instructor._id &&
             !users.some((u) => String(u) === String(userInfo?._id)) && (
                <Button>
                  {" "}
                  {user?.wishlist.find((w) => w._id === _id) ? (
                    <Favorite
                      sx={{ color: "red" }}
                      onClick={handleRemoveCourseFromWishlist}
                    />
                  ) : (
                    <FavoriteBorder
                      sx={{ color: "red" }}
                      onClick={handleAddCourseToWishlist}
                    />
                  )}{" "}
                </Button>
              )}
{/* 
              {(userInfo?.role === "user" || userInfo?.role === "instructor") &&
 user?._id !== instructor?._id &&
 Array.isArray(users) &&
 users.length > 0 &&
 !users.some((u) => String(u._id) === String(userInfo?._id)) && (
   <Button>
     {user?.wishlist?.some((w) => String(w._id) === String(_id)) ? (
       <Favorite
         sx={{ color: "red" }}
         onClick={handleRemoveCourseFromWishlist}
       />
     ) : (
       <FavoriteBorder
         sx={{ color: "red" }}
         onClick={handleAddCourseToWishlist}
       />
     )}
   </Button>
)} */}
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );
}
