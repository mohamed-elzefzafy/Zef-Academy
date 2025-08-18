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
import Image from "next/image";
import PaginationComponent from "@/app/components/PaginationComponent";

const AdminCategoriesPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data ,isLoading} = useGetCategoriesAdminQuery(`?page=${currentPage}`);
  const [deleteCategoryAdminPage] = useDeleteCategoryAdminPageMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const updateCategory = useUpdateCategoryMutation();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "serial",
      width: isSmallScreen ? 60 : 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "name",
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
          field: "image",
          headerName: "Image",
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderCell: (params: GridRenderCellParams) => (
            <Image
              // onClick={() =>
              //   router.push(
              //     `/profile/${params.row.userId}?fromInstructorDashBoard=fromInstructorDashBoard`
              //   )
              // }
              src={params.value}
              alt="userProfile"
              width={40}
              height={40}
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          ),
        },
    {
      field: "actions",
      headerName: "Actions",
      flex: isSmallScreen ? 0.8 : 1,
      width: isSmallScreen ? 100 : 120,
      align: "center",
      headerAlign: "center",

      renderCell: (params: GridRenderCellParams<string[]>) => (
        <>
            <IconButton
            onClick={() =>
              router.push(
                `/admin-dashboard/categories/edit-category/${params.value}`
              )
            }
          >
            <Edit color="info" />
          </IconButton>
          <IconButton
            onClick={() =>
              onDeleteCategory({ _id: params.value, page: currentPage })
            }
            sx={{ padding: isSmallScreen ? "6px" : "8px" }}
          >
            <Delete
              color="error"
              fontSize={isSmallScreen ? "small" : "medium"}
            />
          </IconButton>
      
        </>
      ),
    },
  ];

  const rows =
    data?.categories.map((category, index) => ({
      id: index + 1,
      name: category.title,
      image: category.image.url,
      categoryId: category._id,
      Remove: category._id,
      actions: category._id,
    })) || [];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const onDeleteCategory = async ({ _id, page }: { _id: string; page: number }) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this category? all courses belong it will deleted",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteCategoryAdminPage({ _id, page }).unwrap();
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
          Categories 
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "capitalize" }}
          onClick={() =>
            router.push("/admin-dashboard/categories/add-category")
          }
        >
        Add category
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
              localeText={{
            noRowsLabel: "📭 No data to display",
          }}
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

export default AdminCategoriesPage;
