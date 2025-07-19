"use client";
import { useRegisterUserMutation } from "@/redux/slices/api/authApiSlice";
import { UserRegister } from "@/types/auth";
import { Button, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import * as z from "zod";

const RegisterPage = () => {
  const router = useRouter();
  const [registerUser] = useRegisterUserMutation();
  const [profileImage, setProfileImage] = useState<File | null>();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<UserRegister>();

  const onSubmit = async (values: UserRegister) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const user = await registerUser(formData).unwrap();

      toast.success("you have successfully registered");
      reset();
      setProfileImage(null);
      setTimeout(() => {
        router.push(`/auth/login?userName=${user?.firstName}`);
      }, 2000);
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
        register
      </Typography>
      <TextField
        type="text"
        placeholder="first-name"
        label="first-name"
        sx={{ width: "100%" }}
        {...register("firstName", { required: "first name is required" })}
        error={errors.firstName ? true : false}
        helperText={errors.firstName && "first name is required"}
      />
      <TextField
        type="text"
        placeholder="last-name"
        label="last-name"
        sx={{ width: "100%" }}
        {...register("lastName", { required: "Last name is required" })}
        error={errors.lastName ? true : false}
        helperText={errors.lastName && "Last name is required"}
      />

      <TextField
        type="email"
        placeholder="email"
        label="email"
        sx={{ width: "100%" }}
        {...register("email", { required: "email is required" })}
        error={errors.email ? true : false}
        helperText={errors.email && "email is required"}
      />

      <TextField
        type="password"
        placeholder="password"
        label="password"
        sx={{ width: "100%" }}
        {...register("password", { required: "password is required" })}
        error={errors.password ? true : false}
        helperText={errors.password && "password is required"}
      />

      {profileImage && (
        <Image
          src={URL.createObjectURL(profileImage)}
          width={200}
          height={200}
          style={{ objectFit: "contain", borderRadius: "5px" }}
          alt="profileImage"
        />
      )}
      <TextField
        label="profile-image"
        type="file"
        onChange={handleImageChange}
        fullWidth
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
        disabled={isSubmitting || !isValid}
      >
        register
      </Button>
      <Typography>
        if-you-have-account-already-please
        <Typography component={Link} href="/auth/login">
          login
        </Typography>{" "}
      </Typography>
    </Stack>
  );
};

export default RegisterPage;
