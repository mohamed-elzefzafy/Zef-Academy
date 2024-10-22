// import Topbar from "@/components/layout/Topbar";
import { ReactNode } from "react";


const HomeLayout = ({children}:{children : ReactNode}) => {
  return (
   <>
   {/* <Topbar/> */}
   {children}
   </>
  )
}

export default HomeLayout;