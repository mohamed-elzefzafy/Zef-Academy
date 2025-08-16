import TabPanel from "@mui/lab/TabPanel";
import {
  Avatar,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { BorderColor, Delete, DeleteForever } from "@mui/icons-material";
import { SetStateAction, useState } from "react";
import {
  useCreateReviewMutation,
  useDeleteReviewByAdminMutation,
  useDeleteReviewMutation,
  useGetCourseReviewsQuery,
  useUpdateReviewMutation,
} from "@/redux/slices/api/reviewApiSlice";
import toast from "react-hot-toast";
import { IReview } from "@/types/review";
import { IUserInfo } from "@/types/auth";
import { ICourse } from "@/types/course";

const ReviewsTab = ({
  userInfo,
  course,
}: {
  userInfo: IUserInfo;
  course: ICourse;
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | string>("");
  const [reviewId, setReviewId] = useState("");
  const [showAddButtonState, setshowAddButtonState] = useState(false);
  const theme = useTheme();
  const { data: reviews, refetch: refetchReviews } = useGetCourseReviewsQuery(
    course._id
  );
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [deleteReviewByAdmin] = useDeleteReviewByAdminMutation();

  const deleteReviewByAdminHandler = async (reviewId: string) => {
    try {
      await deleteReviewByAdmin(reviewId).unwrap();
      refetchReviews();
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
    if (review.user._id === userInfo?._id) {
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
      refetchReviews();
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
      refetchReviews();
      toast.success("review added successfully");
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
    }
  };
  const deleteReviewHandler = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap();
      refetchReviews();
      toast.success("Review deleted successfully");
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
    }
  };

  return (
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

            <Typography variant="body1" color={theme.palette.error.dark} mt={1}>
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
                      onClick={() => deleteReviewByAdminHandler(review._id)}
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

      {userInfo.role !== "admin" &&
        course.instructor._id !== userInfo._id &&
        Boolean(course.users.find((user) => user._id === userInfo?._id)) && (
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
  );
};

export default ReviewsTab;
