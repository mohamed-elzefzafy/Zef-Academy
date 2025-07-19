"use client";
import { useGetLecturesQuery } from "@/redux/slices/api/lectureApiSlice";
import { ICourse } from "@/types/course";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "./VideoPlayer";
import Grid, { GridProps } from "@mui/material/Grid";
import Loading from "@/app/loading";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { SetStateAction, useEffect, useState } from "react";
import { ILecture } from "@/types/lecture";
import PdfDownloadButton from "./PdfDownloadButton";
import {
  useCreateReviewMutation,
  useDeleteReviewByAdminMutation,
  useDeleteReviewMutation,
  useGetCourseReviewsQuery,
  useUpdateReviewMutation,
} from "@/redux/slices/api/reviewApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { BorderColor, Delete, DeleteForever } from "@mui/icons-material";
import { IReview } from "@/types/review";
import toast from "react-hot-toast";

const CourseContent = ({ course }: { course: ICourse }) => {
  const [value, setValue] = useState("1");
  const theme = useTheme();
  const { userInfo } = useAppSelector((state) => state?.auth);
  const { data: lectureResponse, isLoading } = useGetLecturesQuery(course._id);
  console.log("Lecture Response:", lectureResponse);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | string>("");
  const [reviewId, setReviewId] = useState("");

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [deleteReviewByAdmin] = useDeleteReviewByAdminMutation();

  const [showAddButtonState, setshowAddButtonState] = useState(false);

  const [selectedLecture, setSelectedLecture] = useState<ILecture | undefined>(
    lectureResponse?.lectures.filter((lecture) => lecture.position === 0)[0]
  );
  const { data: reviews, refetch } = useGetCourseReviewsQuery(course._id);
  console.log(reviews);

  useEffect(() => {
    setSelectedLecture(lectureResponse?.lectures[0]);
    setValue("1");
  }, [lectureResponse?.lectures]);

  if (isLoading) {
    return <Loading />;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const deleteReviewHandler = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap();
      refetch();
      toast.success("Review deleted successfully");
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
    }
  };

  const deleteReviewByAdminHandler = async (reviewId: string) => {
    try {
      await deleteReviewByAdmin(reviewId).unwrap();
      refetch();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
    }
  };

  const handleAddComment = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setComment(event.target.value);
  };

  const handleAddRating = (event: SelectChangeEvent<number>) => {
    setRating(Number(event.target.value));
  };

  const updateReviewHandler = async (review: IReview) => {
    if (review.user._id === userInfo._id) {
      setComment(review.comment);
      setRating(review.rating);
    } else {
      setComment("");
      setRating(0);
    }
    setComment(review.comment);
    setRating(review.rating);
    setReviewId(review._id);
    setshowAddButtonState(true);
    console.log(comment, rating);
  };

  const updateReviewFunc = async (reviewId: string) => {
    if (!reviewId) {
      toast.error("reviewId is required");
      return;
    }
    if (!rating || rating === 0) {
      toast.error("rating is required");
      return;
    }
    if (!comment) {
      toast.error("comment is required");
      return;
    }

    try {
      await updateReview({
        payLoad: { comment: comment, rating: Number(rating) },
        reviewId: reviewId,
      });
      toast.success("Review updated successfully");
      refetch();
      setshowAddButtonState(false);
      setComment("");
      setRating(0);
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
      setshowAddButtonState(false);
    }
  };

  const createReviewHandler = async () => {
    // if (!ProductID) {
    //   toast.error("ProductID is required");
    //   return;
    // }
    if (!rating || rating === 0) {
      toast.error("rating is required");
      return;
    }
    if (!comment) {
      toast.error("comment is required");
      return;
    }

    try {
      await createReview({
        comment: comment.toString(),
        rating: Number(rating),
        course: course._id,
      }).unwrap();
      setComment("");
      setRating(0);
      refetch();
      toast.success("review added successfully");
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
    }
  };

  const selectLectureHandler = (lecture: ILecture) => {
    if (userInfo.role !== "instructor") {
      return
    }
    setSelectedLecture(lecture);
  };

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
        <Typography component="h1" variant="h4">
          {course.title}
        </Typography>
        <Typography component="h1" variant="h6" sx={{ my: 2 }}>
          {course.description}
        </Typography>
        {lectureResponse && lectureResponse?.lectures?.length === 0 && (
          // course?.thumbnail?.url && (
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
          // )
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            justifyContent: { md: "center" },
          }}
        >
          <Stack
            sx={{
              marginTop: 1,
              fontSize: { xs: "16px", md: "20px" },
              mr: { md: "20px" },
              flexDirection: "row",
              gap: 2,
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
            </Typography>
            <Link href={`/profile/${course?.instructor._id}`}>
              : {course.instructor.firstName + " " + course.instructor.lastName}
            </Link>
          </Stack>

          <Stack
            sx={{
              marginTop: 1,
              fontSize: { xs: "16px", md: "20px" },
              mr: { md: "20px" },
              flexDirection: "row",
              gap: 2,
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
            </Typography>
            <Typography>: {course.category.title}</Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            justifyContent: { md: "center" },
          }}
        >
          <Stack
            sx={{
              marginTop: 1,
              fontSize: { xs: "16px", md: "20px" },
              mr: { md: "20px" },
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px" },
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              created at
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px", display: "block" },
                alignContent: "flex-start",
                fontWeight: "bold",
                color: "secondary.main",
              }}
            >
              : {course?.createdAt.substring(0, 10)}
            </Typography>
          </Stack>

          <Stack
            sx={{
              marginTop: 1,
              fontSize: { xs: "16px", md: "20px" },
              mr: { md: "20px" },
              flexDirection: "row",
              gap: 2,
              justifyContent: "center",
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
              total course length
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px", display: "block" },
                alignContent: "flex-start",
                fontWeight: "bold",
                color: "secondary.main",
              }}
            >
              : {course?.videosLength} hours
            </Typography>
          </Stack>
        </Box>

        <Stack sx={{ mt: 2, alignItems: "center", width: "100%" }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: "bold", mb: 2 }}
          >
            Course content:
          </Typography>
        </Stack>

        {selectedLecture && selectedLecture.videoUrl.url && (
          <Box>
            {" "}
            <VideoPlayer
              key={selectedLecture?.videoUrl?.public_id}
              url={selectedLecture?.videoUrl?.url as string}
            />
          </Box>
        )}

        {/* <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }} >
            <TabList onChange={handleChange} aria-label="lab API tabs example" className="red">
              <Tab
                label="lectures"
                value="1"
                sx={{ textTransform: "capitalize" }}
              />
              <Tab
                label="lecture attachments"
                value="2"
                sx={{ textTransform: "capitalize" }}
              />
              <Tab
                label="course reviews"
                value="3"
                sx={{ textTransform: "capitalize" }}
              />
            </TabList>
          </Box>

          <TabPanel
            value="1"
            sx={{ width: { xs: "100%", md: "80%", lg: "70%" } }}
          >
            <Box sx={{ width: "100%", px: { xs: 1, sm: 2, md: 4 }, py: 2 }}>
              <Grid
                container
                spacing={2}
                direction="column"
                sx={{ width: "100%" }}
              >
                {lectureResponse?.lectures.map((lecture) => (
                  <Grid
                    item
                    key={lecture._id}
                    xs={12}
                    component={"div"}
                    {...({ item: true } as GridProps)}
                    sx={{ width: "100%" }}
                  >
                    <Paper
                      onClick={() => {
                        setSelectedLecture(lecture);
                      }}
                      elevation={3}
                      sx={{
                        display: "flex",
                        cursor: "pointer",
                        width: "100%",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: { md: "space-between" },
                        p: { xs: 1, sm: 2 },
                        borderRadius: 2,
                        textDecoration: "none",
                        color: "inherit",
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: "16px", md: "20px" } }}
                        fontWeight={600}
                      >
                        {lecture.position + 1} - Lecture : {lecture.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                      >
                        {`${lecture.videoUrl.videoDuration}   minutes`}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel value="2">
            {selectedLecture?.attachments &&
            selectedLecture?.attachments.length < 1 ? (
              <Typography>
                ther&apos;s no attachments in this lecture
              </Typography>
            ) : (
              <Stack spacing={1}>
                {selectedLecture?.attachments.map((attachment) => (
                  <PdfDownloadButton
                    key={attachment.public_id}
                    url={attachment.url}
                    originalName={attachment.originalName}
                  />
                ))}
              </Stack>
            )}
          </TabPanel>
          <TabPanel value="3">
            { 
      reviews &&  reviews?.length > 0 ?    reviews?.map((review) => (
              <Stack mt={2} key={review._id}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar alt={review.user.firstName} src={review.user.profileImage.url} />
                    <Typography variant="body1">{review.user.firstName}</Typography>
                  </Box>
                  <Box>
                    <Rating
                      name="read-only"
                      value={review?.rating}
                      readOnly
                      size="small"
                      sx={{ mt: 1 }}
                      precision={0.5}
                    />
                  </Box>
                </Stack>

                <Typography
                  variant="body1"
                  color={theme.palette.error.dark}
                  mt={1}
                >
                  {review.createdAt.substring(0, 10)}
                </Typography>

                <Stack mt={1}>
                  <Typography variant="body1">{review.comment}</Typography>
                </Stack>

                {(userInfo?.role === "admin" || userInfo?._id === review?.user._id) && (
                  <>
                    <Stack mt={2} mb={1} flexDirection="row" gap={2}>
                      {userInfo?._id === review?.user._id && (
                        <>
                          <Delete
                            sx={{
                              color: theme.palette.error.main,
                              cursor: "pointer",
                            }}
                            onClick={() => deleteReviewHandler(review?._id)}
                          />
                          <BorderColor
                            onClick={() => updateReviewHandler(review)}
                            sx={{
                              color: theme.palette.primary.main,
                              cursor: "pointer",
                            }}
                          />
                        </>
                      )}
                      {userInfo?.role === "admin" && (
                        <DeleteForever
                          sx={{
                            color: theme.palette.error.dark,
                            cursor: "pointer",
                          }}
                          onClick={() => deleteReviewByAdminHandler(review._id)}
                        />
                      )}
                    </Stack>



                    <Divider />
                  </>
                )}
              </Stack>
            )) : (
              <Typography mt={2} variant="body1">
                There are no reviews for this course yet.
              </Typography>
            )
            
            }

                { userInfo?.email && userInfo.role !== "admin"  &&
    
        <Stack mt={2} component="form" alignItems="flex-start">
          <Typography variant="h6" mb={1}>
            Write a Review
          </Typography>
          <TextField
            type="text"
            placeholder="Write your review"
            sx={{ width: "100%" }}
            value={comment}
            onChange={handleAddComment}
          />
          <FormControl sx={{ minWidth: 200, width: "100%", mt: 2 }}>
            <InputLabel id="rating-label">Rating</InputLabel>
            <Select
              labelId="rating-label"
              value={rating as number}
              label="Rating"
              onChange={handleAddRating}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {[5, 4, 3, 2, 1].map((value) => (
                <MenuItem key={value} value={value}>
                  <Rating name="read-only" value={value} readOnly size="small" precision={0.5} />{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

    {showAddButtonState ?
      <Button
      variant="contained"
      sx={{ mt: 2, 
        bgcolor: theme.palette.mainColor?.main, 
        color: "white" }}
      onClick={()=> updateReviewFunc(reviewId)}
    >
      Update Review
    </Button>  
  :
  <Button
  variant="contained"
  sx={{ mt: 2,
     bgcolor: theme.palette.mainColor?.main, 
     color: "white" }}
  onClick={createReviewHandler}
>
  Add Review
</Button>  
  }
        </Stack>
    
    }
          </TabPanel>
        </TabContext> */}

        <TabContext value={value}>
          {/* Tabs Header */}
          {/* <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider'  }}>
    <TabList
      onChange={handleChange}
      aria-label="course content tabs"
      className="red"
      sx={{ width: '100%' }}
      // لو عندك عناوين طويلة وموبايل صغير وعايز سكرول:
      // variant="scrollable"
      // allowScrollButtonsMobile
    >
      <Tab label="lectures" value="1" sx={{ textTransform: 'capitalize' }} />
      <Tab
        label="lecture attachments"
        value="2"
        sx={{ textTransform: 'capitalize' }}
      />
      <Tab
        label="course reviews"
        value="3"
        sx={{ textTransform: 'capitalize' }}
      />
    </TabList>
  </Box> */}

          <Box
            sx={{
              width: "100%",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
              // bgcolor: 'background.paper',
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="course tabs"
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly", // التوزيع بالتساوي
                flexWrap: "wrap", // لو الشاشة صغيرة ينزلوا تحت بعض
              }}
            >
              <Tab
                label="Lectures"
                value="1"
                sx={{ flex: 1, textTransform: "capitalize" }}
              />
              <Tab
                label="Lecture Attachments"
                value="2"
                sx={{ flex: 1, textTransform: "capitalize" }}
              />
              <Tab
                label="Course Reviews"
                value="3"
                sx={{ flex: 1, textTransform: "capitalize" }}
              />
            </TabList>
          </Box>

          {/* ----- Panel 1: Lectures ----- */}
          <TabPanel
            value="1"
            sx={{
              width: "100%",
              maxWidth: "100%",
              px: { xs: 1, sm: 2, md: 4 }, // بدل ما كنّا مقلّلين العرض
              py: 2,
            }}
          >
            <Grid
              container
              spacing={2}
              direction="column"
              sx={{ width: "100%", m: 0 }}
            >
              {lectureResponse?.lectures?.map((lecture) => (
                <Grid
                  item
                  key={lecture._id}
                  xs={12}
                  component={"div"}
                  {...({ item: true } as GridProps)}
                  sx={{ width: "100%" }}
                >
                  <Paper
                    onClick={() => selectLectureHandler(lecture)}
                    elevation={3}
                    sx={{
                      display: "flex",
                      cursor: "pointer",
                      width: "100%",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: { md: "space-between" },
                      p: { xs: 1, sm: 2 },
                      borderRadius: 2,
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.01)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "13px", sm: "16px", md: "20px" } }}
                      fontWeight={600}
                    >
                      {lecture.position + 1} - Lecture : {lecture.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {`${lecture.videoUrl.videoDuration}   minutes`}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* ----- Panel 2: Attachments ----- */}
          <TabPanel
            value="2"
            sx={{
              width: "100%",
              maxWidth: "100%",
              px: { xs: 1, sm: 2, md: 4 },
            }}
          >
            {selectedLecture?.attachments &&
            selectedLecture?.attachments.length < 1 ? (
              <Typography>
                ther&apos;s no attachments in this lecture
              </Typography>
            ) : (
              <Stack spacing={1} sx={{ width: "100%" }}>
                {selectedLecture?.attachments?.map((attachment) => (
                  <PdfDownloadButton
                    key={attachment.public_id}
                    url={attachment.url}
                    originalName={attachment.originalName}
                  />
                ))}
              </Stack>
            )}
          </TabPanel>

          {/* ----- Panel 3: Reviews ----- */}
          <TabPanel
            value="3"
            sx={{
              width: "100%",
              maxWidth: "100%",
              px: { xs: 1, sm: 2, md: 4 },
            }}
          >
            {reviews && reviews?.length > 0 ? (
              reviews.map((review) => (
                <Stack mt={2} key={review._id} sx={{ width: "100%" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ width: "100%" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        alt={review.user.firstName}
                        src={review.user.profileImage.url}
                      />
                      <Typography variant="body1">
                        {review.user.firstName}
                      </Typography>
                    </Box>
                    <Box>
                      <Rating
                        name="read-only"
                        value={review?.rating}
                        readOnly
                        size="small"
                        sx={{ mt: 1 }}
                        precision={0.5}
                      />
                    </Box>
                  </Stack>

                  <Typography
                    variant="body1"
                    color={theme.palette.error.dark}
                    mt={1}
                  >
                    {review.createdAt.substring(0, 10)}
                  </Typography>

                  <Stack mt={1}>
                    <Typography variant="body1">{review.comment}</Typography>
                  </Stack>

                  {(userInfo?.role === "admin" ||
                    userInfo?._id === review?.user._id) && (
                    <>
                      <Stack mt={2} mb={1} flexDirection="row" gap={2}>
                        {userInfo?._id === review?.user._id && (
                          <>
                            <Delete
                              sx={{
                                color: theme.palette.error.main,
                                cursor: "pointer",
                              }}
                              onClick={() => deleteReviewHandler(review?._id)}
                            />
                            <BorderColor
                              onClick={() => updateReviewHandler(review)}
                              sx={{
                                color: theme.palette.primary.main,
                                cursor: "pointer",
                              }}
                            />
                          </>
                        )}
                        {userInfo?.role === "admin" && (
                          <DeleteForever
                            sx={{
                              color: theme.palette.error.dark,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              deleteReviewByAdminHandler(review._id)
                            }
                          />
                        )}
                      </Stack>
                      <Divider />
                    </>
                  )}
                </Stack>
              ))
            ) : (
              <Typography mt={2} variant="body1">
                There are no reviews for this course yet.
              </Typography>
            )}

            {userInfo?.email && userInfo.role !== "admin" && (
              <Stack
                mt={2}
                component="form"
                alignItems="flex-start"
                sx={{ width: "100%" }}
              >
                <Typography variant="h6" mb={1}>
                  Write a Review
                </Typography>
                <TextField
                  type="text"
                  placeholder="Write your review"
                  sx={{ width: "100%" }}
                  value={comment}
                  onChange={handleAddComment}
                />
                <FormControl sx={{ minWidth: 200, width: "100%", mt: 2 }}>
                  <InputLabel id="rating-label">Rating</InputLabel>
                  <Select
                    labelId="rating-label"
                    value={rating as number}
                    label="Rating"
                    onChange={handleAddRating}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <MenuItem key={value} value={value}>
                        <Rating
                          name="read-only"
                          value={value}
                          readOnly
                          size="small"
                          precision={0.5}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {showAddButtonState ? (
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: theme.palette.mainColor?.main,
                      color: "white",
                    }}
                    onClick={() => updateReviewFunc(reviewId)}
                  >
                    Update Review
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: theme.palette.mainColor?.main,
                      color: "white",
                    }}
                    onClick={createReviewHandler}
                  >
                    Add Review
                  </Button>
                )}
              </Stack>
            )}
          </TabPanel>
        </TabContext>
      </Stack>
    </Container>
  );
};

export default CourseContent;
