"use client";
import { useAppSelector } from "@/redux/hooks";
import { Edit } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

const DeleteUserProfileButton = ({
  onDeleteCurrentUser,
  userId
}: {
  onDeleteCurrentUser: () => void;
  userId: string
}) => {
  const { userInfo } = useAppSelector((state) => state?.auth);

  return (
    <>
      {userInfo._id === userId ? (
        <Box
          sx={{
            borderBlockColor: "secondary.main",
            borderBlockWidth: 1,
            borderBlockStyle: "solid",
            borderRadius: 2,
            padding: 1,
            width: "50%",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            my: 3,
          }}
        >
          <Button
            endIcon={<Edit />}
            variant="text"
            size="large"
            color="error"
            sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            onClick={onDeleteCurrentUser}
          >
            delete-my-account
          </Button>
        </Box>
      ) : (
        <Box></Box>
      )}
    </>
  );
};

export default DeleteUserProfileButton;
