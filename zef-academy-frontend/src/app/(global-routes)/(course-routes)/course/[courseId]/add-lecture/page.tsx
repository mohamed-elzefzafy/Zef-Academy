"use client";
import { useCreateLectureMutation } from "@/redux/slices/api/lectureApiSlice";
import { ILectureData } from "@/types/lecture";
import { KeyboardDoubleArrowRight, PlayCircle } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEvent, use, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageIcon from "@mui/icons-material/Image";

const AddAttachmentsPage = ({params}: {params: Promise<{ courseId: string }>}) => {
  const router = useRouter();
    const resolvedParams = use(params);
  const [createLecture] = useCreateLectureMutation();
  const [videoUrl, setVideoUrl] = useState<File | null>();

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoUrl(e.target.files[0]);
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors ,isValid},
  } = useForm<ILectureData>();

  const onSubmit = async (values: ILectureData) => {
    console.log(values);
    
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.position !== undefined) {
      formData.append("position", values.position.toString());
    }
    formData.append("course", resolvedParams.courseId);
    if (!videoUrl) {
return toast.error("Please upload a video lecture");
    }
      formData.append("videoUrl", videoUrl);
    // }

    try {
       await createLecture(formData).unwrap();

      toast.success("you have created lecture successfully");
      reset();
      setVideoUrl(null);
      // setTimeout(() => {
      router.push(`/course/${resolvedParams.courseId}`);
      // }, 2000);
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };
  
  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: { xs: "70%", md: "30%" },
        mx: "auto",
        mt: 5,
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2"  sx={{mt:2}}>
        add lecture
        <Tooltip
          title={"back to home page"}
          placement="right-end"
          enterDelay={200}
        >
          <IconButton onClick={() => router.push(`/course/${resolvedParams.courseId}`)}>
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Typography>
      <TextField
        type="text"
        placeholder="title"
        label="title"
        sx={{ width: "100%" }}
        {...register("title", { required: "title is required" })}
        error={errors.title ? true : false}
        helperText={errors.title && "title is required"}
      />
      <TextField
        type="number"
        placeholder="lecture position"
        label="position"
        {...register("position", {min:1})}
        sx={{ width: "100%" }}
        {...register("position")}
      />
  
      {/* <TextField
        label="lecuure video"
        type="file"
        onChange={handleVideoChange}
        fullWidth
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
        disabled={isSubmitting}
      >
      add-lecture
      </Button> */}

            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ textTransform: "capitalize" }}
              startIcon={<PlayCircle />}
            >
              {videoUrl ? "video lecture selected" : "Upload Lecture Video"}
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleVideoChange}
              />
            </Button>
      
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !isValid}
              sx={{ textTransform: "capitalize", position: "relative" }}
            >
              {isSubmitting ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Add Lecture"
              )}
            </Button>
    </Stack>
  );
};

export default AddAttachmentsPage;
