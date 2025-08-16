"use client";
import { useAddLectureAttachmentsMutation } from "@/redux/slices/api/lectureApiSlice";
import {
  KeyboardDoubleArrowRight,
  PictureAsPdf,
  PlayCircle,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Input, FormControl, InputLabel } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, use, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddAttachmentsPage = ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const router = useRouter();
  const searchPrams = useSearchParams();
  const selectedLectureId = searchPrams.get("selectedLectureId");

  const resolvedParams = use(params);
  const [addLectureAttachments] = useAddLectureAttachmentsMutation();
  const [pdfFiles, setPdfFiles] = useState<File[] | null>([]);

  const handlePdfUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setPdfFiles(filesArray);
    }
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    const formData = new FormData();
    pdfFiles?.forEach((pdf) => formData.append("attachments", pdf));

    try {
      await addLectureAttachments({
        payLoad: formData,
        lectureId: selectedLectureId,
      }).unwrap();

      toast.success("attachments added to lecture successfully");
      reset();
      setPdfFiles(null);
      router.push(`/course/${resolvedParams.courseId}`);
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
      <Typography variant="h6" component="h2">
        add-lecture
        <Tooltip
          title={"back to home page"}
          placement="right-end"
          enterDelay={200}
        >
          <IconButton
            onClick={() => router.push(`/course/${resolvedParams.courseId}`)}
          >
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Typography>

      {/* <FormControl fullWidth margin="normal">
  <InputLabel shrink htmlFor="attachments">Attachments</InputLabel>
  <Input
    id="attachments"
    type="file"
    inputProps={{ multiple: true, accept: "application/pdf" }}
    onChange={handlePdfUpload}
  />
</FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
        disabled={isSubmitting}
      >
      add-attachments
      </Button> */}

      <Button
        component="label"
        variant="outlined"
        fullWidth
        sx={{ textTransform: "capitalize" }}
        startIcon={<PictureAsPdf />}
      >
        {pdfFiles && pdfFiles?.length > 0
          ? "attachments selected"
          : "Upload attachments"}
        <input
          type="file"
          hidden
          accept="application/pdf"
          multiple
          onChange={handlePdfUpload}
        />
      </Button>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
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
          "Add attachments"
        )}
      </Button>
    </Stack>
  );
};

export default AddAttachmentsPage;
