import { apiSlice } from "./apiSlice";
import { ICurrentUserInstructorRequest } from "@/types/InstructorRequest";

export const instructorRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInstructorRequest: builder.mutation({
      query: () => ({
        url: `/api/v1/instructor-request`,
        method: "POST",
      }),
    }),

    getCurrentUserInstructorRequest: builder.query<ICurrentUserInstructorRequest,string | void>({
      query: () => ({
        url: `/api/v1/instructor-request/currentUser-instructor-request`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["InstructorRequest"],
    }),

    accessResultStatu: builder.mutation({
      query: (id) => ({
        url: `/api/v1/instructor-request/accessResultStatu/${id}`,
        method: "DELETE",
      }),
    }),

    // getCategories: builder.query<ICategoryResponse, void>({
    //   query: () => ({
    //     url: `/api/v1/category`,
    //   }),
    //   keepUnusedDataFor: 5,
    //   providesTags: ["Category"],
    // }),

    // updateCategory: builder.mutation({
    //   query: ({ payLoad, categoryId }) => ({
    //     url: `/api/v1/category/${categoryId}`,
    //     headers: {
    //       "Cache-Control": "no-store", // Prevent caching
    //     },
    //     method: "PATCH",
    //     body: payLoad,
    //   }),
    // }),

    // getOneCategory: builder.query<ICategory, string | void>({
    //   query: (id) => ({
    //     url: `/api/v1/category/${id}`,
    //   }),
    //   keepUnusedDataFor: 5,
    //   providesTags: ["Category"],
    // }),

    // getCategoriesAdmin: builder.query<ICategoryResponse, string | void>({
    //   query: (queries = "") => ({
    //     url: `/api/v1/category${queries}&_t=${Date.now()}`,
    //     headers: {
    //       "Cache-Control": "no-store",
    //     },
    //   }),
    //   keepUnusedDataFor: 1,
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.categories.map(({ _id }) => ({
    //             type: "Category" as const,
    //             _id,
    //           })),
    //           { type: "Category", id: "LIST" },
    //         ]
    //       : [{ type: "Category", id: "LIST" }],
    // }),

    // deleteCategoryAdminPage: builder.mutation<
    //   void,
    //   { _id: string; page?: number }
    // >({
    //   query: ({ _id }) => ({
    //     url: `/api/v1/category/${_id}`,
    //     method: "DELETE",
    //   }),
    //   async onQueryStarted({ _id, page }, { dispatch, queryFulfilled }) {
    //     const queryParams = `?page=${page}`;
    //     const patchResult = dispatch(
    //       categoryApiSlice.util.updateQueryData(
    //         "getCategoriesAdmin",
    //         queryParams,
    //         (draft: ICategoryResponse) => {
    //           draft.categories = draft.categories.filter(
    //             (category) => category._id !== _id
    //           );
    //           draft.pagination.total -= 1;
    //           if (draft.categories.length === 0 && page && page > 1) {
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
    //   invalidatesTags: (result, error, { _id }) => [{ type: "Category", _id }],
    // }),
  }),
});

export const {
  useCreateInstructorRequestMutation,
  useGetCurrentUserInstructorRequestQuery,
  useAccessResultStatuMutation,
} = instructorRequestApiSlice;
