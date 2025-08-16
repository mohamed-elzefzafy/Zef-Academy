"use client";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/redux/slices/api/categoryApiSlice";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createSearchKeywordAction } from "@/redux/slices/searchSlice";
import PostsComponent from "./_componens/CoursesComponent";
import Grid from "@mui/material/Grid";
import SearchParamComponent from "./_componens/SearchParamComponent";
import {
  useDeleteCourseHomePageMutation,
  useGetCoursesQuery,
} from "@/redux/slices/api/courseApiSlice";
import CoursesComponent from "./_componens/CoursesComponent";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  paddingLeft : 0,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(1),
    width: "auto",
    minWidth: "200px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  fontSize: "14px",
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      fontSize: "16px",
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Home() {
  const router = useRouter();
  const searcParam = useSearchParams();
  const searchPramQuery = searcParam.get("CategoryIdfromAdminDashBoard");
  const dispatch = useAppDispatch();
  const { searchKeyWord } = useAppSelector((state) => state.search);
  const [searchWord, setSearchWord] = useState("");
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(searchPramQuery || "");
  const [deleteCourseHomePage] = useDeleteCourseHomePageMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: coursesResponse, refetch , isLoading} = useGetCoursesQuery(
    `?search=${searchKeyWord || ""}&page=${currentPage}&category=${category}`
  );

  const resetFiltersAndSearch = () => {
    setCategory("");
    setSearchWord("");
    setCurrentPage(1);
    dispatch(createSearchKeywordAction(""));
    refetch();
  };
  return (
    <Container>
      <Stack sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 2 }}>
                <SearchParamComponent returnPath="/admin-dashboard/categories" />
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            "& img": {
              objectFit: "cover",
              width: "100%",
              height: "100%",
            },
          }}
        >
          <Image
            alt="hero"
            src="/zef-acemy-hero.png"
            width={1920}
            height={1080}
            quality={100}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            alignItems: "space-between",
            justifyContent: "center",
            mb: 2,
            mt: 3,
            width: { xs: "100%", sm: "80%", md: "60%" },
          }}
        >
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Search sx={{ border: "1px solid gray", flexGrow: 1 }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="search"
                  inputProps={{ "aria-label": "search" }}
                  onChange={(e) => {
                    dispatch(createSearchKeywordAction(e.target.value));
                    setSearchWord(e.target.value);
                  }}
                  value={searchWord}
                />
              </Search>
              <Button
                size="small"
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  minWidth: "80px",
                  height: "100%",
                  py: 1,
                }}
                onClick={resetFiltersAndSearch}
              >
                reset
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value={""}>all-categories</MenuItem>
                {categoriesResponse?.categories?.map((category) => (
                  <MenuItem value={category._id} key={category._id}>
                    {category.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {( userInfo.role === "instructor") && (
          <Box
            sx={{
              py: 2,
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Button
              variant="contained"
              size="medium"
              sx={{
                width: { xs: "100%", sm: "200px" },
                textTransform: "capitalize",
                maxWidth: "250px",
              }}
              onClick={() => router.push("/add-course")}
            >
              add-Course
            </Button>
          </Box>
        )}
        {coursesResponse && (
          <CoursesComponent
            courses={coursesResponse.courses}
            pagination={coursesResponse.pagination}
            refetchCourses={refetch}
            setCurrentPage={setCurrentPage}
            page={currentPage}
            search={searchKeyWord}
            category={category}
            deleteCourse={deleteCourseHomePage}
            loadingCourse={isLoading}
          />
        )}
      </Stack>
    </Container>
  );
}
