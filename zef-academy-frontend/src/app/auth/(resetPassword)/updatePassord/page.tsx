"use client";
import { useUpdatePasswordMutation } from "@/redux/slices/api/authApiSlice";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IUpdatePassord {
  email: string;
  verificationCode: string;
  newPassword: string;
}

const UpdatePassord = () => {
  const router = useRouter();
  const [updatePassword] = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<IUpdatePassord>();

  const onSubmit = async (values: IUpdatePassord) => {
    try {
      const { user } = await updatePassword(values).unwrap();
      toast.success("you reset your password please login");
      router.push(`/auth/login?userNameFromUpdatePassword=${user?.firstName}`);
      reset();
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
        Update Password
      </Typography>

      <TextField
        type="email"
        placeholder="Email"
        label="Email"
        sx={{ width: "100%" }}
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        type="text"
        placeholder="Verification Code"
        label="Verification Code"
        sx={{ width: "100%" }}
        {...register("verificationCode", {
          required: "Verification code is required",
        })}
        error={!!errors.verificationCode}
        helperText={errors.verificationCode?.message}
      />

      <TextField
        type="password"
        placeholder="Password"
        label="Password"
        sx={{ width: "100%" }}
        {...register("newPassword", { required: "password is required" })}
        error={errors.newPassword ? true : false}
        helperText={errors.newPassword && "password is required"}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
        disabled={isSubmitting || !isValid}
      >
        Update Passord
      </Button>
    </Stack>
  );
};

export default UpdatePassord;
