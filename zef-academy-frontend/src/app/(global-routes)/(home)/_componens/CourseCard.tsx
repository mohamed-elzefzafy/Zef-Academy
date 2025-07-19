"use client";
import Grid from "@mui/material/Grid";
import { useAppSelector } from "@/redux/hooks";
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

interface CourseCardProps {
  course: ICourse;
  refetchCourses: () => void;
  page: number;
  search?: string;
  category?: string;
  userId?: string;
  deleteCourse: (args: {
    _id: string;
    page?: number;
    search?: string;
    category?: string;
    userId?: string;
  }) => void;
}
export default function CourseCard({
  course: { title , description, thumbnail, category: courseCategory, _id, instructor },
  page,
  search,
  category,
  userId,
  deleteCourse,
}: CourseCardProps) {
  const router = useRouter();
  const { userInfo } = useAppSelector((state) => state.auth);

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


  return (
    <Grid size={{ xs: 12, lg: 6 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: { xs: "100%", sm: 600, md: 700, lg: 500 },
          width: "100%",
          height: { xs: 350, sm: 300 },
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
              justifyContent: { xs: "center", sm: "flex-start" },
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
            {/* {(userInfo._id === instructor._id || userInfo.role === "admin") && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={onDeleteCourse}
                sx={{ textTransform: "capitalize", fontWeight: "bold" }}
              >
                delete-post
              </Button>
            )} */}
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );
}
