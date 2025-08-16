"use client";
import { useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import {
  useDeleteCategoryAdminPageMutation,
  useGetCategoriesAdminQuery,
  useUpdateCategoryMutation,
} from "@/redux/slices/api/categoryApiSlice";
import Link from "next/link";
import PaginationComponent from "@/app/[locale]/components/PaginationComponent";
import { useTranslations } from "next-intl";

const AdminCategoriesPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetCategoriesAdminQuery(`?page=${currentPage}`);
  const [deleteCategoryAdminPage] = useDeleteCategoryAdminPageMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const updateCategory = useUpdateCategoryMutation();
  const t = useTranslations("Categories-Table-page");

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("serial"),
      width: isSmallScreen ? 60 : 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: t("name"),
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
            href={`/?CategoryIdfromAdminDashBoard=${params.row.categoryId}`}
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
      field: "postsCount",
      headerName: t("Posts-under-the-category"),
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Remove",
      headerName: t("remove"),
      width: isSmallScreen ? 80 : 100,
      align: "center",
      headerAlign: "center",

      renderCell: (params: GridRenderCellParams<string[]>) => (
        <>
          <IconButton
            onClick={() =>
              onDeletePost({ id: params.value, page: currentPage })
            }
            sx={{ padding: isSmallScreen ? "6px" : "8px" }}
          >
            <Delete
              color="error"
              fontSize={isSmallScreen ? "small" : "medium"}
            />
          </IconButton>
          <IconButton
            onClick={() =>
              router.push(
                `/admin-dashboard/categories/edit-category/${params.value}`
              )
            }
          >
            <Edit color="info" />
          </IconButton>
        </>
      ),
    },
  ];

  const rows =
    data?.categories.map((category, index) => ({
      id: index + 1,
      name: category.title,
      postsCount: category?.posts.length,
      categoryId: category.id,
      Remove: category.id,
    })) || [];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const onDeletePost = async ({ id, page }: { id: number; page: number }) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this category?",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteCategoryAdminPage({ id, page }).unwrap();
        router.refresh();
        toast.success("category deleted successfully");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete category";
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
          mr: 7,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          sx={{ my: 1, fontWeight: "bold" }}
        >
          {t("categories")} :
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "capitalize" }}
          onClick={() =>
            router.push("/admin-dashboard/categories/add-category")
          }
        >
          {t("add-category")}
        </Button>
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

export default AdminCategoriesPage;
