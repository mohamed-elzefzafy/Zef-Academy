"use client";
import { useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { useDeleteUserAdminPageMutation } from "@/redux/slices/api/userApiSlice";
import Image from "next/image";
import Link from "next/link";
import PaginationComponent from "@/app/components/PaginationComponent";
import { useDeleteReviewByAdminMutation, useGetAdminReviewsQuery } from "@/redux/slices/api/reviewApiSlice";

const AdminReviewsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data ,isLoading} = useGetAdminReviewsQuery(`?page=${currentPage}`);
  const [deleteReviewByAdmin] = useDeleteReviewByAdminMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [pageSize, setPageSize] = useState(10);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "serial",
      width: isSmallScreen ? 60 : 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "comment",
      headerName:  "Comment",
      flex: isSmallScreen ? 0.8 : 1,
      minWidth: isSmallScreen ? 120 : 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: 1.2,
            padding: "4px",
            color : "primary.main"
          }}
        >
          <Link
            href={`/course/${params.row.courseId}?fromAdminDashBoardReviews=fromAdminDashBoardReviews`}
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            {params.value}
          </Link>
        </Box>
      ),
    },
    {
      field: "rating",
      headerName:  "Rating",
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "course",
      headerName:  "Course",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "user",
      headerName: "User",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: 1.2,
            padding: "4px",
            fontWeight: "bold",
            color: params.row.role === "admin" ? "error.main" :params.row.role === "instructor"? "secondary.main" :null,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName:  "Since",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 100,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "Remove",
      headerName: "remove",
      width: isSmallScreen ? 80 : 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
      <>
      
          <IconButton
          onClick={() => onDeleteReview( params.value)}
          sx={{ padding: isSmallScreen ? "6px" : "8px" }}
        >
          <Delete color="error" fontSize={isSmallScreen ? "small" : "medium"} />
        </IconButton>
      
      </>
      ),
    },
  ];

  const rows =
    data?.reviews.map((review, index) => ({
      id: index + 1,
      comment: review.comment,
      rating: review.rating,
      user: review.user.firstName + " " + review.user.lastName,
      course: review.course.title,
      createdAt: review.createdAt.substring(0, 10),
      Remove: review._id,
      courseId : review.course._id,
    })) || [];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const onDeleteReview = async (_id: string) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this review ?",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteReviewByAdmin(_id).unwrap();
        router.refresh();
        toast.success("review deleted successfully");
      }
    } catch (error) {
      console.error("Delete review error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete review";
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        mt: 2,
        px: isSmallScreen ? 1 : 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          px: 1,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          sx={{ my: 1, fontWeight: "bold" }}
        >
          Reviews 
        </Typography>
      </Stack>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          "& .MuiDataGrid-root": {
            borderRadius: 1,
            boxShadow: theme.shadows[2],
            height: "calc(100vh - 65px)",
          },
        }}
      >
              <DataGrid
          rows={rows}
          columns={columns}
          paginationMode="server" // Use server-side pagination
          rowCount={data?.pagination.total || 0} // Total number of rows from backend
          pageSizeOptions={[5, 10, 15]} // Match backend limit options
          paginationModel={{
            page: currentPage - 1, // DataGrid uses 0-based indexing
            pageSize,
          }}
          onPaginationModelChange={(model) => {
            setCurrentPage(model.page + 1); // Convert to 1-based indexing for backend
            setPageSize(model.pageSize);
          }}
          loading={isLoading}
          sx={{
            fontSize: isSmallScreen ? "12px" : "14px",
            "& .MuiDataGrid-cell": {
              padding: isSmallScreen ? "4px" : "8px",
              lineHeight: 1.2,
            },
            "& .MuiDataGrid-columnHeader": {
              padding: isSmallScreen ? "4px" : "8px",
              backgroundColor: theme.palette.background.paper,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: isSmallScreen ? "12px" : "14px",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: isSmallScreen ? "auto" : "hidden",
            },
          }}
        />
      </Box>

      {data?.pagination && data?.pagination.pagesCount > 1 && (
        <PaginationComponent
          count={data.pagination.pagesCount}
          currentPage={data.pagination.page}
          handlePageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default AdminReviewsPage;
