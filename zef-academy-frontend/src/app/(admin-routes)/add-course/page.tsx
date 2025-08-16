"use client";
import { useGetCategoriesQuery } from "@/redux/slices/api/categoryApiSlice";
import { useCreateCourseMutation } from "@/redux/slices/api/courseApiSlice";
import { ICourseData } from "@/types/course";
import {
  ImageAspectRatio,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Optionally: import category data
// import { useGetAllCategoriesQuery } from "@/redux/slices/api/categoryApiSlice";

const AddCoursePage = () => {
  const router = useRouter();
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const [createCourse] = useCreateCourseMutation();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ICourseData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discount: 0,
      isFree: false,
      category: "",
      thumbnail: {},
    },
  });

  const isFree = watch("isFree");

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: ICourseData) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);

      if (values.isFree) {
        formData.append("price", "0");
        formData.append("discount", "0");
        formData.append("isFree", "true");
      } else {
        formData.append("price", values.price.toString());
        formData.append("discount", values.discount.toString());
        formData.append("isFree", "false");
      }

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await createCourse(formData).unwrap();

      toast.success("Course created successfully! wait for admin approval");
      reset();
      setThumbnailFile(null);
      router.push("/");
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: { xs: "90%", md: "40%" },
        mx: "auto",
        mt: 5,
        gap: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <Typography variant="h6" component="h2">
          Add New Course
        </Typography>
        <Tooltip title="Back to previous page" enterDelay={200}>
          <IconButton onClick={() => router.back()}>
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        label="Course Title"
        fullWidth
        {...register("title", { required: "Title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        label="Description"
        multiline
        rows={3}
        fullWidth
        {...register("description", {
          required: "Description is required",
          minLength: {
            value: 20,
            message: "Description must be at least 20 characters",
          },
        })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      <TextField
        select
        label="Category"
        fullWidth
        defaultValue=""
        {...register("category", { required: "Category is required" })}
        error={!!errors.category}
        helperText={errors.category && "Category is required"}
      >
        {(categoriesResponse?.categories?.length ?? 0) > 0 ? (
          categoriesResponse?.categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.title}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            No categories available
          </MenuItem>
        )}
      </TextField>
      <Controller
        name="isFree"
        control={control}
        render={({ field }) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Switch
              checked={field.value}
              onChange={(_, checked) => field.onChange(checked)}
            />
            <Typography>Is the course free?</Typography>
          </Box>
        )}
      />

      {!isFree && (
        <>
          <TextField
            label="Price"
            type="number"
            fullWidth
            {...register("price", {
              required: "Price is required",
              min: { value: 10, message: "Price must be at least 10" },
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            label="Discount"
            type="number"
            fullWidth
            {...register("discount", {
              min: { value: 0, message: "Discount cannot be negative" },
              max: {
                value: watch("price"),
                message: "Discount cannot be more than price",
              },
            })}
            error={!!errors.discount}
            helperText={errors.discount?.message}
          />
        </>
      )}

      {thumbnailFile && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image
            src={URL.createObjectURL(thumbnailFile)}
            width={200}
            height={200}
            style={{ objectFit: "contain", borderRadius: "5px" }}
            alt="profileImage"
          />
        </Box>
      )}

      <Button
        component="label"
        variant="outlined"
        fullWidth
        sx={{ textTransform: "capitalize" }}
        startIcon={<ImageIcon />}
      >
        {thumbnailFile ? "Thumbnail selected" : "Upload course thumbnail"}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleThumbnailChange}
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
          "Create Course"
        )}
      </Button>
    </Stack>
  );
};

export default AddCoursePage;
