"use server";
import { protectedRequest } from "@/common/utils/request";
import { AxiosError } from "axios";

export default async function checkout(courseId: string) {
  try {
    const res = await protectedRequest.post("/api/v1/checkout/session", {
      courseId,
    });
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      error: axiosError.response?.data?.message || "create checkout failed",
    };
  }
}
