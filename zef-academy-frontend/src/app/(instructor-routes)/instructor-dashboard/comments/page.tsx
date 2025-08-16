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
import PaginationComponent from "@/app/[locale]/components/PaginationComponent";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useDeleteCommentAdminAdminDashPageMutation,
  useGetCommentsAdminQuery,
} from "@/redux/slices/api/commentApiSlice";
import { useTranslations } from "next-intl";

const AdminCommentsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetCommentsAdminQuery(`?page=${currentPage}`);
  const [deleteCommentAdminAdminDashPage] =
    useDeleteCommentAdminAdminDashPageMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const t = useTranslations("Comments-Table-page");

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("serial"),
      width: isSmallScreen ? 60 : 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "text",
      headerName: t("comment"),
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
          }}
        >
          <Link
            href={`/post/${params.row.postId}?fromAdminDashBoardComments=fromAdminDashBoardComments`}
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
      field: "post",
      headerName: t("post"),
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
          }}
        >
          <Link
            href={`/post/${params.row.postId}?fromAdminDashBoardComments=fromAdminDashBoardComments`}
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
      field: "Remove",
      headerName: t("remove"),
      width: isSmallScreen ? 80 : 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() =>
            onDeleteComment({ id: params.value, page: currentPage })
          }
          sx={{ padding: isSmallScreen ? "6px" : "8px" }}
        >
          <Delete color="error" fontSize={isSmallScreen ? "small" : "medium"} />
        </IconButton>
      ),
    },
  ];

  const rows =
    data?.comments.map((comment, index) => ({
      id: index + 1,
      text: comment.text.slice(0, 10) + (comment.text.length > 10 ? "..." : ""),
      post: comment.post.title,
      commentId: comment.id,
      postId: comment.post.id,
      Remove: comment.id,
    })) || [];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const onDeleteComment = async ({
    id,
    page,
  }: {
    id: number;
    page: number;
  }) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this Comment?",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteCommentAdminAdminDashPage({ id, page }).unwrap();
        router.refresh();
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Delete Comment error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete Comment";
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
          {t("comments")} :
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
          autoPageSize={isSmallScreen}
          pageSizeOptions={[5, 10, 20]}
          disableColumnMenu={isSmallScreen}
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
            "& .MuiDataGrid-footerContainer": {
              display: "none",
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

export default AdminCommentsPage;
