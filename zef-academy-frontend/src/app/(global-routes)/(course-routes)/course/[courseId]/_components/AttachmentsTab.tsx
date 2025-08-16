import TabPanel from "@mui/lab/TabPanel";
import { Tooltip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import PdfDownloadButton from "./PdfDownloadButton";
import { ILecture } from "@/types/lecture";
import { IUserInfo } from "@/types/auth";
import { ICourse } from "@/types/course";
import { useRemoveLectureAttachmentsMutation } from "@/redux/slices/api/lectureApiSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";

const AttachmentsTab = ({
  selectedLecture,
  userInfo,
  course,
}: {
  selectedLecture: ILecture | undefined;
  userInfo: IUserInfo;
  course: ICourse;
}) => {
  const [selectedLectureState, setSelectedLectureState] = useState(selectedLecture?.attachments)
  const [removeLectureAttachments] = useRemoveLectureAttachmentsMutation();

  useEffect(()=>{
    setSelectedLectureState(selectedLecture?.attachments)
  },[selectedLecture?.attachments])
  const handleRemoveLectureAttachments = async (publicId: string) => {
    try {
      await removeLectureAttachments({
        lectureId: selectedLecture?._id,
        publicId: publicId,
      });
      // refetch();
      setSelectedLectureState(selectedLectureState?.filter(attachment => attachment.public_id !== publicId))
      toast.success("attachment trmoved successfully");
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } }).data
        ?.message;
      toast.error(errorMessage as string);
    }
  };
  return (
    <TabPanel
      value="2"
      sx={{
        width: "100%",
        maxWidth: "100%",
        px: { xs: 1, sm: 2, md: 4 },
      }}
    >
      {selectedLectureState && selectedLectureState?.length > 0 && (
        <Typography
          sx={{ mb: 3 }}
        >{`(${selectedLecture?.title}) Lecture Attachments : `}</Typography>
      )}
      {selectedLectureState &&
      selectedLectureState.length < 1 ? (
        <Typography>There are no attachments for this lecture</Typography>
      ) : (
        <Stack spacing={1} sx={{ width: "100%" }}>
          {selectedLectureState?.map((attachment) => (
            <Box
              key={attachment.public_id}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <PdfDownloadButton
                url={attachment.url}
                originalName={attachment.originalName}
              />
              {userInfo._id === course.instructor._id && (
                      <Tooltip
                                                title={"remove attachment "}
                                                placement="right-end"
                                                enterDelay={200}
                                              >
                <Delete
                  sx={{ color: "red", cursor: "pointer" ,"&:hover" : {transform: "scale(1.1)", transition : "all 0.5s"}}}
                  onClick={() => handleRemoveLectureAttachments(attachment.public_id as string)}
                /> 
                </Tooltip>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </TabPanel>
  );
};

export default AttachmentsTab;
