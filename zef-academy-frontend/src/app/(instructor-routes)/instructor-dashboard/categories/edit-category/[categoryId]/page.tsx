"use client";
import { useCreateCategoryMutation, useGetOneCategoryQuery, useUpdateCategoryMutation } from "@/redux/slices/api/categoryApiSlice";
import { IAddCategory } from "@/types/category";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const EditCategoryAdminPage = ({ params }: { params: Promise<{ categoryId: string }> }) => {
    const router = useRouter();
    const resolvedParams = use(params);
    const {data : category ,refetch} = useGetOneCategoryQuery(resolvedParams.categoryId);
    
  const [updateCategory] = useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    // reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<IAddCategory>();


      useEffect(() => {
      if (category) {
        setValue("title", category.title);
        refetch();
      }
    }, [category, refetch, setValue] );

  const onSubmit = async (values: IAddCategory) => {
    console.log(values);
    
    try {
          await updateCategory({
        payLoad: values,
        categoryId: resolvedParams.categoryId,
      }).unwrap();
      router.refresh();
      toast.success("you have created category successfully");
      // reset();
      setTimeout(() => {
        router.push(`/admin-dashboard/categories`);
      }, 1000);
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };

  const t = useTranslations("update-category");
  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: { xs: "70%", md: "40%" },
        mx: "auto",
        height: { xs: "calc(100vh - 8rem)", sm: "calc(100vh - 9rem)" },
        mt: 10,
        display: "flex",
        alignItems: "flex-start",
        justifyItems: "center",
        justifyContent: "flex-start",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ ml: 2 }}>
        {t("update-category")}
        <Tooltip
          title={"back to Categories admin dashboard"}
          placement="right-end"
          enterDelay={200}
        >
          <IconButton
            onClick={() => router.push(`/admin-dashboard/categories`)}
          >
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Typography>
      <TextField
        type="text"
        placeholder={t("title")}
        defaultValue={category?.title}
        label={t("title")}
        sx={{ width: "100%" }}
        {...register("title", { required: "title is required" })}
        error={errors.title ? true : false}
        helperText={errors.title && "title is required"}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
        disabled={isSubmitting}
      >
        {t("update-category")}
      </Button>
    </Stack>
  );
};

export default EditCategoryAdminPage;
