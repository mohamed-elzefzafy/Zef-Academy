"use client"
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useUpdateUserMutation } from "@/redux/slices/api/authApiSlice";
import { setCredentials } from "@/redux/slices/authSlice";
import { IUserUpdate, IUserUpdate2, UserRegister } from "@/types/auth";
import { Button, Stack, TextField, Typography } from "@mui/material"
import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const EditUserProfile = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
      const { userInfo } = useAppSelector((state) => state?.auth);
    const [updateUser] = useUpdateUserMutation();
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
    } = useForm<IUserUpdate>();
  
    const onSubmit = async (values: IUserUpdate) => {
      console.log("values", values);
      
      const formData = new FormData();
      formData.append("firstName", values.firstName || "");
      formData.append("lastName", values.lastName || "");
    if (values.password) {
      formData.append("password", values.password)
    }else 
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
  
      try {
        const user = await updateUser(formData).unwrap();
  
        toast.success("you have successfully registered");
          dispatch(setCredentials({ ...user }));
        reset();
        setProfileImage(null);
        setTimeout(() => {
          router.push(`/profile/${userInfo._id}`);
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
      update-profile
      </Typography>
      <TextField
        type="text"
        placeholder="first-name"
        defaultValue={userInfo?.firstName}
        label="first-name"
        sx={{ width: "100%" }}
        {...register("firstName", { required: "first name is required" })}
        error={errors.firstName ? true : false}
        helperText={errors.firstName && "first name is required"}
      />
      <TextField
        type="text"
        placeholder="last-name"
        defaultValue={userInfo?.lastName}
        label="last-name"
        sx={{ width: "100%" }}
        {...register("lastName", { required: "Last name is required" })}
        error={errors.lastName ? true : false}
        helperText={errors.lastName && "Last name is required"}
      />


      <TextField
        type="password"
        placeholder="password"
        label="password"
        sx={{ width: "100%" }}
        {...register("password")}
        error={errors.password ? true : false}
        helperText={errors.password && "password is required"}
      />

      {profileImage ? (
        <Image
          src={URL.createObjectURL(profileImage)}
          width={200}
          height={200}
          style={{ objectFit: "contain", borderRadius: "5px" }}
          alt="profileImage"
        />
      ) : userInfo.profileImage?.url ?(
            <Image
          src={userInfo.profileImage.url}
          width={200}
          height={200}
          style={{ objectFit: "contain", borderRadius: "5px" }}
          alt="profileImage"
        />  
      ): null
      }
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
        save
      </Button>

    </Stack>
  )
}

export default EditUserProfile;