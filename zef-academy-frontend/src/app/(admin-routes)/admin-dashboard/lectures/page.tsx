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
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaginationComponent from "@/app/components/PaginationComponent";
import { useDeleteCourseAdminInstructorPageMutation } from "@/redux/slices/api/courseApiSlice";
import Image from "next/image";
import {
  useDeleteLecturesInstructorPageMutation,
  useGetInstructorCoursesLecturesQuery,
} from "@/redux/slices/api/lectureApiSlice";

const InstructorCoursesPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetInstructorCoursesLecturesQuery(currentPage);
  const [deleteLecturesInstructorPage] =
    useDeleteLecturesInstructorPageMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [pageSize, setPageSize] = useState(10); // Default page size

  console.log("dataIns", data);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "serial",
      width: isSmallScreen ? 60 : 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "title",
      flex: isSmallScreen ? 0.8 : 1,
      minWidth: isSmallScreen ?100 : 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "course",
      headerName: "Course",
      flex: isSmallScreen ? 0.5 : 0.5,
      width: isSmallScreen ? 100 : 120,
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
            href={`/course/${params.row.courseId}?fromLecturesInstructorDashBoard=fromLecturesInstructorDashBoard`}
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
    // {
    //   field: "thumbnail",
    //   headerName: "Thumbnail",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",

    //   renderCell: (params: GridRenderCellParams) => (
    //     <Image
    //       onClick={() =>
    //         router.push(
    //           `/profile/${params.row.userId}?fromInstructorDashBoard=fromInstructorDashBoard`
    //         )
    //       }
    //       src={params.value}
    //       alt="userProfile"
    //       width={40}
    //       height={40}
    //       style={{
    //         width: "40px",
    //         height: "40px",
    //         objectFit: "cover",
    //         borderRadius: "50%",
    //         cursor: "pointer",
    //       }}
    //     />
    //   ),
    // },
    // {
    //   field: "category",
    //   headerName: "category",
    //   flex: isSmallScreen ? 0.6 : 0.8,
    //   minWidth: isSmallScreen ? 80 : 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "finalPrice",
    //   headerName: "Price",
    //   flex: isSmallScreen ? 0.6 : 0.8,
    //   minWidth: isSmallScreen ? 80 : 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "auther",
    //   headerName: "author",
    //   flex: isSmallScreen ? 0.6 : 0.8,
    //   minWidth: isSmallScreen ? 80 : 100,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <Box
    //       sx={{
    //         whiteSpace: "normal",
    //         wordWrap: "break-word",
    //         lineHeight: 1.2,
    //         padding: "4px",
    //       }}
    //     >
    //       {params.value}
    //     </Box>
    //   ),
    // },
    // {
    //   field: "isPublished",
    //   headerName: "Published - Not",
    //   flex: isSmallScreen ? 0.6 : 0.8,
    //   minWidth: isSmallScreen ? 80 : 120,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "createdAt",
      headerName: "created at",
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 80 : 100,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "isFree",
    //   headerName: "Free - Not",
    //   flex: isSmallScreen ? 0.6 : 0.8,
    //   minWidth: isSmallScreen ? 80 : 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: isSmallScreen ? 80 : 100,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params: GridRenderCellParams) => (
    //     <Stack
    //       sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         gap: 1,
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       <IconButton
    //         onClick={() => router.push(`/update-course/${params.row.courseId}`)}
    //         sx={{ padding: isSmallScreen ? "6px" : "8px" }}
    //       >
    //         <Edit
    //           color="primary"
    //           fontSize={isSmallScreen ? "small" : "medium"}
    //         />
    //       </IconButton>
    //       <IconButton
    //         onClick={() =>
    //           onDeleteCourse({ _id: params.row.courseId, page: currentPage })
    //         }
    //         sx={{ padding: isSmallScreen ? "6px" : "8px" }}
    //       >
    //         <Delete
    //           color="error"
    //           fontSize={isSmallScreen ? "small" : "medium"}
    //         />
    //       </IconButton>
    //     </Stack>
    //   ),
    // },
    {
      field: "Remove",
      headerName: "Remove lecture",
      flex: isSmallScreen ? 0.5 : 0.5,
      width: isSmallScreen ? 60 : 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <IconButton
            onClick={() => router.push(`/update-course/${params.row.courseId}`)}
            sx={{ padding: isSmallScreen ? "6px" : "8px" }}
          >
            <Edit
              color="primary"
              fontSize={isSmallScreen ? "small" : "medium"}
            />
          </IconButton> */}
          <IconButton
            onClick={() =>
              onDeleteLecture({ _id: params.row.lectureId, page: currentPage })
            }
            sx={{ padding: isSmallScreen ? "6px" : "8px" }}
          >
            <Delete
              color="error"
              fontSize={isSmallScreen ? "small" : "medium"}
            />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows =
    data?.lectures.map((lecture, index) => ({
      id: index + 1,
      title: lecture.title,
      // thumbnail: course.thumbnail.url,
      course: lecture.course?.title,
      // finalPrice: course.finalPrice,
      // isPublished: course.isPublished ? "Published" : "Not Published",
      // isFree: course.isFree ? "Free" : "Not Free",
      createdAt: lecture.createdAt.substring(0, 10),
      Remove: lecture._id,
      lectureId: lecture._id,
      courseId: lecture.course._id,
    })) || [];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const onDeleteLecture = async ({
    _id,
    page,
  }: {
    _id: string;
    page: number;
  }) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "if you delete this lecture it's attachments will be deleted",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await deleteLecturesInstructorPage({ _id, page }).unwrap();
        router.refresh();
        toast.success("lecture deleted successfully");
      }
    } catch (error) {
      console.error("Delete lecture error:", error);
      const errorMessage =
        (error as { data?: { message?: string } }).data?.message ||
        "Failed to delete lecture";
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
          Lectures :
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

export default InstructorCoursesPage;
