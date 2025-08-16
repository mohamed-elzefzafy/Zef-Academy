"use client";
import { useAppSelector } from "@/redux/hooks";
import { useGetCategoriesQuery } from "@/redux/slices/api/categoryApiSlice";
import { useGetOneCourseQuery, useUpdateCourseMutation } from "@/redux/slices/api/courseApiSlice";
import { ICourseData } from "@/types/course";
import {
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";


const UpdateCoursePage = ({ params }: { params: Promise<{ courseId: string }> }) => {
  const router = useRouter();
    const resolvedParams = use(params);
  const { data: course , isLoading : isCourseLoading} = useGetOneCourseQuery(resolvedParams.courseId);
  const { data: categoriesResponse , isLoading : isCategoryLoading } = useGetCategoriesQuery();
  const [updateCourse] = useUpdateCourseMutation();
    const { userInfo } = useAppSelector((state) => state?.auth);


  const [category, setCategory] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);




    useEffect(() => {
    if (course?.category?._id) {
      setCategory(`${course.category._id}`);
    }
  }, [course]);

  useEffect(() => {
    if (isCourseLoading || !course || !userInfo) {
      return; // Wait until post and userInfo are loaded
      }

    if (course.instructor._id.toString() !== userInfo._id.toString()) {
      router.push("/"); 
    }
  }, [course, isCourseLoading, router, userInfo]);

  
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ICourseData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discount: 0,
      isFree: course?.isFree || false,
      category: "",
      thumbnail: {},
    },
  });

    const isFree = watch("isFree");

    useEffect(() => {
    if (course) {
      setValue("title", course.title);
      setValue("description", course.description);
        setValue("category", course.category._id);
      setCategory(`${course.category._id}`);
      setValue("isFree", course.isFree || false);
      if (!course.isFree) {
        setValue("price", course.price);
        setValue("discount", course.discount);
      }
    }
  }, [course, setValue]);



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

        await updateCourse({
        payLoad: formData,
        courseId: resolvedParams.courseId,
      }).unwrap();

      toast.success("Course updated successfully");
      reset();
      setThumbnailFile(null);
      router.push("/instructor-dashboard/courses");
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };

    if (isCourseLoading || isCategoryLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 7 }}>
        <CircularProgress />
      </Box>
    );
  }
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
          Update Course
        </Typography>
        <Tooltip title="Back to previous page" enterDelay={200}>
          <IconButton onClick={() => router.back()}>
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        label="Course Title"
        defaultValue={course?.title}
        fullWidth
        {...register("title", { required: "Title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        label="Description"
        defaultValue={course?.description}
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



        <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="demo-simple-select-label">category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          {...register("category", { required: "category is required" })}
          label="category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoriesResponse?.categories?.map((category) => (
            <MenuItem value={category._id} key={category._id}>
              {category.title}
            </MenuItem>
          ))}
        </Select>
        {errors.category && (
          <FormHelperText error>{errors.category.message}</FormHelperText>
        )}
      </FormControl>


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

      {thumbnailFile ? (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image
            src={URL.createObjectURL(thumbnailFile)}
            width={200}
            height={200}
            style={{ objectFit: "contain", borderRadius: "5px" }}
            alt="profileImage"
          />
        </Box>
      ) :
          course?.thumbnail.url ?  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image
            src={course?.thumbnail.url }
            width={200}
            height={200}
            style={{ objectFit: "contain", borderRadius: "5px" }}
            alt="profileImage"
          />
        </Box> : null
      
      }

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
          "Update Course"
        )}
      </Button>
    </Stack>
  );
};

export default UpdateCoursePage;
