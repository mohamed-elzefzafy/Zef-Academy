import { ICourse } from "@/types/course";
import { ILectureResponse } from "@/types/lecture";
import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Image from "next/image";
import Link from "next/link";

const CourseData = ({
  course,
  lectureResponse,
}: {
  course: ICourse;
  lectureResponse: ILectureResponse | undefined;
}) => {
  return (
    <>
      <Typography component="h1" variant="h4">
        {course.title}
      </Typography>
      <Typography component="h1" variant="body1" sx={{ my: 2 }}>
        {course.description}
      </Typography>
      {lectureResponse && lectureResponse?.lectures?.length === 0 && (
        <Box
          sx={{
            width: { xs: "100%", md: 1000 },
            height: { xs: 300, md: 500 },
            position: "relative",
            marginTop: 2,
          }}
        >
          <Image
            src={course.thumbnail.url}
            alt={course.title}
            fill
            style={{ borderRadius: 10, objectFit: "contain" }}
          />
        </Box>
      )}

      <Stack>
        {/* instructor  */}
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
              instructor
            </Typography>{" "}
            <Link href={`/profile/${course?.instructor._id}`}>
              : {course.instructor.firstName + " " + course.instructor.lastName}
            </Link>
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
              category
            </Typography>{" "}
            : {course.category.title}
          </Typography>
        </Box>

        {/* created at  */}

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
              color: "secondary.main",
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
              created at
            </Typography>{" "}
            : {course?.createdAt.substring(0, 10)}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "16px", md: "20px" },
              color: "secondary.main",
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
              total course length
            </Typography>{" "}
            : {course?.videosLength} hours
          </Typography>
        </Box>

        {/* price  */}

        {!course.isFree && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: { xs: "flex-start", sm: "center" },
              width: "100%",
              gap: { xs: 1, md: 2 },
              mt: 2,
            }}
          >
            {/* <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px" },
              }}
            > */}
            <Typography
              component="span"
              sx={{
                fontSize: { xs: "16px", md: "20px" },
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              Price :
            </Typography>{" "}
            {course.discount > 0 && (
              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  fontWeight: "bold",
                  color: "text.disabled",
                  textDecoration: "line-through",
                }}
              >
                {course.price}
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px" },
                color: "secondary.main",
              }}
            >
              {course.finalPrice}
            </Typography>
          </Box>
        )}
      </Stack>

      <Stack sx={{ mt: 2, alignItems: "center", width: "100%" }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: "bold", mb: 2 }}
        >
          Course content:
        </Typography>
      </Stack>
    </>
  );
};

export default CourseData;
