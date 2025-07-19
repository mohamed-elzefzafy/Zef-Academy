"use client";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/slices/api/authApiSlice";
import { setCredentials } from "@/redux/slices/authSlice";
import { UserLogin } from "@/types/auth";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const userNameQuery = searchParams.get("userName");
  const userNameQueryFromUpdatePassword = searchParams.get(
    "userNameFromUpdatePassword"
  );
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<UserLogin>();

  const onSubmit = async (values: UserLogin) => {
    try {
      const { user } = await login(values).unwrap();

      toast.success("you have successfully logged in");
      dispatch(setCredentials({ ...user }));
      router.push(`/`);
      reset();
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };
  return (
    <>
      {userNameQuery && (
        <Box
          sx={{
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            width: "100%",
            mt: 5,
          }}
        >
          <Typography sx={{ mx: "auto", display: "flex", gap: 1 }}>
          thanks
            <Typography component="span" sx={{ color: lightBlue[700] }}>
              {userNameQuery}
            </Typography>{" "}
          for-register-please login
          </Typography>
        </Box>
      )}

      {userNameQueryFromUpdatePassword && (
        <Box
          sx={{
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            width: "100%",
            mt: 5,
          }}
        >
          <Typography sx={{ mx: "auto", display: "flex", gap: 1 }}>
            thanks{" "}
            <Typography component="span" sx={{ color: lightBlue[700] }}>
              {userNameQueryFromUpdatePassword}
            </Typography>{" "}
            for reset Password please login
          </Typography>
        </Box>
      )}
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
        login
        </Typography>

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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
          disabled={isSubmitting || !isValid}
        >
          login
        </Button>
        <Typography>
        if-you-don&apos;t-have-account-please
          <Typography component={Link} href="/auth/register" sx={{ ml: 1 }}>
            register
          </Typography>{" "}
        </Typography>
        <Typography>
          if-you-forgot-your-password-please-go
          <Typography component={Link} href="/auth/resetPassword">
            {" "}
            here
          </Typography>
        </Typography>
      </Stack>
    </>
  );
};

export default LoginPage;
