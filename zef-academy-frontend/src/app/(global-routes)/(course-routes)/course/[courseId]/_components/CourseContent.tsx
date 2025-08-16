"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tab,
  TextField,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import {
  Favorite,
  FavoriteBorder,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useGetLecturesQuery } from "@/redux/slices/api/lectureApiSlice";
import {
  useCreateCourseDiscountMutation,
  useUpdateCourseToFreeMutation,
  useUpdateCourseToNotFreeMutation,
} from "@/redux/slices/api/courseApiSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ICourse } from "@/types/course";
import { ILecture } from "@/types/lecture";

import VideoPlayer from "./VideoPlayer";
import Loading from "@/app/loading";
import LecturesTab from "./LecturesTab";
import AttachmentsTab from "./AttachmentsTab";
import ReviewsTab from "./ReviewsTab";
import CourseData from "./CourseData";
import Checkout from "@/app/checkout/Checkout";
import SearchInstructorDash from "@/app/components/SearchInstructorDash";
import { useGetOneUserQuery } from "@/redux/slices/api/authApiSlice";
import { setCredentials } from "@/redux/slices/authSlice";
import {
  useAddCourseToWishlistMutation,
  useRemoveCourseFromWishlistMutation,
} from "@/redux/slices/api/wislistApiSlice";

const CourseContent = ({ course }: { course: ICourse }) => {
  const [value, setValue] = useState("1");
  const dispatch = useAppDispatch();
  // const [newDiscount, setNewDiscount] = useState(course.discount ?? 0);
  const router = useRouter();
  const { userInfo } = useAppSelector((state) => state?.auth);

  const {
    data: lectureResponse,
    isLoading,
    refetch,
  } = useGetLecturesQuery(course._id);
  const [updateCourseToFree] = useUpdateCourseToFreeMutation();
  const [updateCourseToNotFree] = useUpdateCourseToNotFreeMutation();
  const [createCourseDiscount] = useCreateCourseDiscountMutation();

  const [selectedLecture, setSelectedLecture] = useState<ILecture | undefined>(
    lectureResponse?.lectures?.find((lecture) => lecture.position === 1)
  );

  const isAuthorized =
    userInfo?.role === "instructor" && userInfo._id === course.instructor._id;

  const [valid, setValid] = useState(
    isAuthorized ||
      Boolean(course.users.find((user) => user._id === userInfo?._id)) ||
      course.isFree
  );

  const [openNotFreeModal, setOpenNotFreeModal] = useState(false);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);

  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [newDiscount, setNewDiscount] = useState<number>(course.discount ?? 0);

  const [addCourseToWishlist] = useAddCourseToWishlistMutation();
  const [removeCourseFromWishlist] = useRemoveCourseFromWishlistMutation();

  useEffect(() => {
    setSelectedLecture(
      lectureResponse?.lectures?.find((lecture) => lecture.position === 1)
    );
    setValue("1");
    setNewDiscount(course.discount ?? 0);
    setValid(
      isAuthorized ||
        Boolean(course.users.find((user) => user._id === userInfo?._id)) ||
        course.isFree
    );
  }, [
    course.discount,
    course.isFree,
    course.users,
    isAuthorized,
    lectureResponse?.lectures,
    userInfo?._id,
  ]);

  if (isLoading) return <Loading />;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const canSeeBuyButton =
    !course.users.find((user) => user._id === userInfo?._id) &&
    course.instructor._id !== userInfo?._id &&
    userInfo.role !== "admin" &&
    !course.isFree;

  const handleUpdateCourseToFree = async () => {
    try {
      await updateCourseToFree(course._id).unwrap();
      toast.success("Course is now free");
      router.refresh();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage || "Failed to update course");
    }
  };

  const handleUpdateCourseToNotFree = async () => {
    try {
      await updateCourseToNotFree({
        courseId: course._id,
        payLoad: { price, discount },
      }).unwrap();
      toast.success("Course is no longer free");
      setPrice(0);
      setDiscount(0);
      setOpenNotFreeModal(false);
      router.refresh();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage || "Failed to update course");
    }
  };

  const CreateCourseDiscount = async () => {
    try {
      await createCourseDiscount({
        courseId: course._id,
        payLoad: { discount: newDiscount },
      }).unwrap();
      toast.success("Discount created/updated successfully");
      setNewDiscount(0);
      setOpenDiscountModal(false);
      router.refresh();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage || "Failed to create discount");
    }
  };

  const handleAddCourseToWishlist = async () => {
    try {
      const user = await addCourseToWishlist({ course: course._id }).unwrap();
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
      const user = await removeCourseFromWishlist(course._id).unwrap();
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
    <Container sx={{ alignItems: "center", justifyContent: "center" }}>
      <Stack
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          py: 5,
          minHeight: "calc(100vh - 68.5px)",
        }}
      >
        <SearchInstructorDash />
        <CourseData course={course} lectureResponse={lectureResponse} />

        {selectedLecture?.videoUrl?.url && (
          <Box>
            <VideoPlayer
              key={selectedLecture?.videoUrl?.public_id}
              url={selectedLecture?.videoUrl?.url}
            />
          </Box>
        )}

        {/* {(userInfo.role === "user" || userInfo.role === "instructor") &&
          userInfo?._id !== course.instructor._id &&
          course.instructor._id !== userInfo?._id &&
          !course.users.some((u) => String(u._id) === String(userInfo?._id)) && (
            <Button>
              {" "}
              {userInfo?.wishlist.some((w) => String(w) === String(course._id)) ? (
                <Button
                  sx={{ color: "secondary.main"}}
                  onClick={handleRemoveCourseFromWishlist}
                  startIcon={<Favorite/>}
                >Remove course from wishList </Button>
              ) : (
                <Button
                  sx={{ color: "secondary.main" }}
                  startIcon={<FavoriteBorder/>}
                  onClick={handleAddCourseToWishlist}
                >Add course to wishList</Button>
              )}{" "}
            </Button>
          )} */}

{(userInfo.role === "user" || userInfo.role === "instructor") &&
  userInfo?._id !== course.instructor._id &&
  !course.users.some((u) => String(u._id) === String(userInfo?._id)) && (
    userInfo?.wishlist.some((w) => String(w) === String(course._id)) ? (
      <Button
        sx={{ color: "secondary.main" }}
        onClick={handleRemoveCourseFromWishlist}
        startIcon={<Favorite />}
      >
        Remove course from wishList
      </Button>
    ) : (
      <Button
        sx={{ color: "secondary.main" }}
        startIcon={<FavoriteBorder />}
        onClick={handleAddCourseToWishlist}
      >
        Add course to wishList
      </Button>
    )
)}




        {canSeeBuyButton && (
          <Box sx={{ width: "100%", my: 2 }}>
            if you want to buy the ({course.title}) course
            <Checkout courseId={course._id} />
          </Box>
        )}

        {course.instructor._id === userInfo._id && (
          <Box
            sx={{
              width: "100%",
              my: 3,
              display: "flex",
              justifyContent: "flex-start",
              gap: 5,
              flexWrap: "wrap",
            }}
          >
            {course.isFree ? (
              <Button
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
                onClick={() => setOpenNotFreeModal(true)}
              >
                make course not free
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleUpdateCourseToFree}
                >
                  make course free
                </Button>

                <Button
                  variant="outlined"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => setOpenDiscountModal(true)}
                >
                  Add or change discount
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              sx={{ textTransform: "capitalize" }}
              onClick={() => router.push(`/course/${course._id}/add-lecture`)}
            >
              Add Lecture
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: "capitalize" }}
              endIcon={<KeyboardArrowDown />}
              onClick={() =>
                router.push(
                  `/course/${course._id}/add-attachments?selectedLectureId=${selectedLecture?._id}`
                )
              }
            >
              add Attachments to this lecture
            </Button>
          </Box>
        )}

        <TabContext value={value}>
          <Box
            sx={{
              width: "100%",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="course tabs"
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
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

          <LecturesTab
            isAuthorized={isAuthorized}
            lectureResponse={lectureResponse}
            refetch={refetch}
            valid={valid}
            setSelectedLecture={setSelectedLecture}
            selectedLecture={selectedLecture}
            course={course}
            userInfo={userInfo}
          />

          <AttachmentsTab
            selectedLecture={selectedLecture}
            course={course}
            userInfo={userInfo}
          />
          <ReviewsTab course={course} userInfo={userInfo} />
        </TabContext>
      </Stack>

      {/* Modal: Make Course Not Free */}
      <Dialog
        open={openNotFreeModal}
        onClose={() => setOpenNotFreeModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Set Course Price & Discount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Price (USD)"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotFreeModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCourseToNotFree}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Add/Change Discount */}
      <Dialog
        open={openDiscountModal}
        onClose={() => setOpenDiscountModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add or Update Discount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            value={newDiscount}
            onChange={(e) => setNewDiscount(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDiscountModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={CreateCourseDiscount}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseContent;
