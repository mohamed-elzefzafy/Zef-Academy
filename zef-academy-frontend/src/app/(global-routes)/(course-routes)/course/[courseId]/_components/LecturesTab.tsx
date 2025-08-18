"use client";
import TabPanel from "@mui/lab/TabPanel";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Grid, { GridProps } from "@mui/material/Grid";
import { Paper, Tooltip, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { ILecture, ILectureResponse } from "@/types/lecture";
import toast from "react-hot-toast";
import { useRemoveLectureMutation, useUpdateLecturePositionMutation } from "@/redux/slices/api/lectureApiSlice";
import { Delete } from "@mui/icons-material";
import { IUserInfo } from "@/types/auth";
import { ICourse } from "@/types/course";

interface ILecturesTabProps {
  lectureResponse: ILectureResponse | undefined;
  isAuthorized: boolean;
  selectedLecture: ILecture | undefined;
  setSelectedLecture: (lecture: ILecture) => void;
  valid: boolean;
  refetch: () => void;
    userInfo: IUserInfo;
    course: ICourse;
}
const LecturesTab = ({
  lectureResponse,
  isAuthorized,
  selectedLecture,
  setSelectedLecture,
  valid,
  refetch,
  userInfo,
  course,
}: ILecturesTabProps) => {
  const theme = useTheme();
  const [updateLecturePosition] = useUpdateLecturePositionMutation();
  const [removeLecture] = useRemoveLectureMutation();
  const selectLectureHandler = (lecture: ILecture) => {
    if (!valid) {
      return;
    }
    setSelectedLecture(lecture);
  };



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = async (result: any) => {
  console.log("Drag result:", result);
  if (!result.destination || !lectureResponse?.lectures) {
    console.log("No destination or lectures missing");
    return;
  }

  const { source, destination } = result;
  console.log(`Dragging from index ${source.index} to ${destination.index}`);

  // Copy lectures array
  const lectures = [...lectureResponse.lectures];
  const [reorderedLecture] = lectures.splice(source.index, 1);
  lectures.splice(destination.index, 0, reorderedLecture);

  // Convert destination index to 1-based position for backend
  const newPosition = destination.index + 1;

  try {
    const response = await updateLecturePosition({
      payLoad: { position: newPosition }, // 1-based
      lectureId: reorderedLecture._id,
    }).unwrap();

    console.log("Update position response:", response);
    refetch();
    toast.success(`Lecture moved to position ${newPosition}`);
  } catch (error) {
    const errorMessage = (error as { data?: { message?: string } }).data?.message;
    toast.error(errorMessage || "Failed to update lecture position");
  }
};


    const handleRemoveLecture = async (lectureId: string) => {
    try {
      await removeLecture(lectureId);
      refetch();
      // setSelectedLectureState(selectedLectureState?.filter(attachment => attachment.public_id !== publicId))
      toast.success("lecture trmoved successfully");
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
    }
  };

  return (
    <TabPanel
      value="1"
      sx={{
        width: "100%",
        maxWidth: "100%",
        px: { xs: 1, sm: 2, md: 4 },
        py: 2,
      }}
    >
      {lectureResponse?.lectures?.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="lectures"
            isDropDisabled={!isAuthorized}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided, snapshot) => (
              <Grid
                container
                spacing={2}
                direction="column"
                sx={{
                  width: "100%",
                  m: 0,
                  backgroundColor: snapshot.isDraggingOver
                    ? theme.palette.action.hover
                    : "transparent",
                }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {lectureResponse.lectures.map((lecture, index) => (
                  <Draggable
                    key={lecture._id}
                    draggableId={lecture._id}
                    index={index}
                    isDragDisabled={!isAuthorized}
                  >
                    {(provided, snapshot) => (
                      <Grid
                        item
                        xs={12}
                        component={"div"}
                        {...({ item: true } as GridProps)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={
                          provided.draggableProps.style as React.CSSProperties
                        }
                        sx={{ width: "100%" }}
                      >
                        <Paper
                          onClick={() => selectLectureHandler(lecture)}
                          elevation={3}
                          sx={{
                            display: "flex",
                            cursor: "pointer",
                            width: "100%",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: { md: "space-between" },
                            alignItems: {
                              xs: "flex-start",
                              md: "center",
                            },
                            p: { xs: 1, sm: 2 },
                            borderRadius: 2,
                            textDecoration: "none",
                            border: `1px solid ${
                              lecture._id === selectedLecture?._id
                                ? "#d35400"
                                : "transparent"
                            }`,
                            color: "inherit",
                            transition: "all 0.3s",
                            backgroundColor: snapshot.isDragging
                              ? theme.palette.action.selected
                              : theme.palette.background.paper,
                            "&:hover": {
                              boxShadow: 6,
                              transform: "scale(1.005)",
                              transition: "all 0.5s",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              width: { xs: "100%", md: "auto" },
                            }}
                          >
                            {isAuthorized && (
                              <Box
                                {...provided.dragHandleProps}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "grab",
                                  "&:active": { cursor: "grabbing" },
                                }}
                              >
                                <DragIndicatorIcon
                                  sx={{
                                    color: theme.palette.text.secondary,
                                  }}
                                />
                              </Box>
                            )}
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: {
                                  xs: "13px",
                                  sm: "16px",
                                  md: "20px",
                                },
                                fontWeight: 600,
                              }}
                            >
                              {lecture.position} -  {lecture.title}{" "}
                                  {userInfo._id === course.instructor._id && (    <Tooltip
                                title={"remove lecture"}
                                placement="right-end"
                                enterDelay={200}
                              >
                                <Delete
                                  sx={{
                                    color: "red",
                                    cursor: "pointer",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                      transition: "all 0.5s",
                                    },
                                  }}
                                  onClick={() => handleRemoveLecture(lecture._id)}
                                />
                              </Tooltip>)}
                          
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={{ xs: 0.5, md: 0 }}
                          >
                            {lecture.videoUrl
                              ? `${lecture.videoUrl.videoDuration} minutes`
                              : "🔒 Locked – Subscribe to access"}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Typography>No lectures available.</Typography>
      )}
    </TabPanel>
  );
};

export default LecturesTab;
