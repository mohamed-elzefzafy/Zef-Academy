"use client"
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation"

const SearchParamComponent = ({returnPath} : {returnPath :string}) => {
  const searchPram = useSearchParams();
  const router = useRouter();
  const searchParamQuery = searchPram.get("fromAdminDashBoard");
  return (
<>
{(searchParamQuery === "fromAdminDashBoard" || searchPram.get("CategoryIdfromAdminDashBoard") ) ?  

      <>
          <Button
            sx={{ textAlign: "center", textTransform: "capitalize" }}
            onClick={() => router.push(returnPath)}
          >
            back to Admin Dashboard
          </Button>
      </> : (
(searchPram.get("fromAdminDashBoardComments") && searchPram.get("fromAdminDashBoardComments") === "fromAdminDashBoardComments") &&  

          <Button
            sx={{ textAlign: "center", textTransform: "capitalize" }}
            onClick={() => router.push("/admin-dashboard/comments")}
          >
            back to Admin Dashboard
          </Button>
      

      )
      
}


</>
  )
}

export default SearchParamComponent