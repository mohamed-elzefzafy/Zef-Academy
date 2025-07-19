import { Box } from "@mui/material";
import React from "react";
import Checkout from "../checkout/Checkout";

const page = () => {
  return (
    <Box>
      Zef-Academy
      <Checkout courseId={"685d70cb80b9767d6596f05d"} />
    </Box>
  );
};

export default page;
