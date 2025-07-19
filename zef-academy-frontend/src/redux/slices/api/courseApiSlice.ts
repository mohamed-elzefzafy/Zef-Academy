import { ICourse, ICourseResponse } from "@/types/course";
import { apiSlice } from "./apiSlice";

export const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<ICourseResponse, string | void>({
      query: (queries = "") => ({
        url: `/api/v1/course${queries}&_t=${Date.now()}`,
        headers: {
          "Cache-Control": "no-store",
        },
      }),
      keepUnusedDataFor: 1,
      providesTags: (result) =>
        result
          ? [
              ...result.courses.map(({ _id }) => ({
                type: "Course" as const,
                _id,
              })),
              { type: "Course", _id: "LIST" },
            ]
          : [{ type: "Course", _id: "LIST" }],
    }),

    deleteCourseHomePage: builder.mutation<
      void,
      { _id: string; page?: number; search?: string; category?: string }
    >({
      query: ({ _id }) => ({
        url: `/api/v1/course/${_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { _id, page, search = "", category = "" },
        { dispatch, queryFulfilled }
      ) {
        const queryParams = `?search=${search}&page=${page}&category=${category}`;
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData(
            "getCourses",
            queryParams,
            (draft: ICourseResponse) => {
              draft.courses = draft.courses.filter(
                (course) => course._id !== _id
              );
              draft.pagination.total -= 1;
              if (draft.courses.length === 0 && page && page > 1) {
                draft.pagination.page = page - 1;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { _id }) => [{ type: "Course", _id }],
    }),

        deleteCourseProfilePage: builder.mutation<
      void,
      { _id: string; page?: number; userId :string }
>({
      query: ({ _id }) => ({
        url: `/api/v1/course/${_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { _id, page, userId },
        { dispatch, queryFulfilled }
      ) {
        const queryParams = `?page=${page}&user=${userId}`;
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData(
            "getCourses",
            queryParams,
            (draft: ICourseResponse) => {
              draft.courses = draft.courses.filter((course) => course._id !== _id);
              draft.pagination.total -= 1;
              if (draft.courses.length === 0 && page && page > 1) {
                draft.pagination.page = page - 1;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { _id }) => [{ type: "Course", _id }],
    }),

    getPostsAdmin: builder.query<ICourseResponse, string | void>({
      query: (queries) => ({
        url: `/api/v1/course${queries}`,
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Course"],
    }),

    getOneCourse: builder.query<ICourse, string | void>({
      query: (_id) => ({
        url: `/api/v1/course/${_id}`,
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Course"],
    }),

    createCourse: builder.mutation({
      query: (data) => ({
        url: `/api/v1/course`,
        method: "POST",
        body: data,
      }),
    }),

    updateCourse: builder.mutation({
      query: ({ payLoad, courseId }) => ({
        url: `/api/v1/course/${courseId}`,
        method: "PATCH",
        body: payLoad,
      }),
    }),

    deleteCourse: builder.mutation({
      query: (_id) => ({
        url: `/api/v1/course/${_id}`,
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // deletePostAdminPage: builder.mutation<void, { _id: string; page?: number }>({
    //   query: ({ _id }) => ({
    //     url: `/api/v1/post/${_id}`,
    //     method: "DELETE",
    //   }),
    //   async onQueryStarted({ _id, page }, { dispatch, queryFulfilled }) {
    //     const queryParams = `?page=${page}`;
    //     const patchResult = dispatch(
    //       postApiSlice.util.updateQueryData(
    //         "getPosts",
    //         queryParams,
    //         (draft: ICourseResponse) => {
    //           draft.courses = draft.courses.filter((course) => course._id !== _id);
    //           draft.pagination.total -= 1;
    //           if (draft.courses.length === 0 && page && page > 1) {
    //             draft.pagination.page = page - 1;
    //           }
    //         }
    //       )
    //     );
    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       patchResult.undo();
    //     }
    //   },
    //   invalidatesTags: (result, error, { _id }) => [{ type: "Course", _id }],
    // }),
  }),
});

export const {
  useCreateCourseMutation,
  useDeleteCourseHomePageMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetOneCourseQuery,
  useLazyGetCoursesQuery,
  useLazyGetOneCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseProfilePageMutation,
} = coursesApiSlice;
