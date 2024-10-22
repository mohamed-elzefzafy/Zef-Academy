import SideBar from "@/components/layout/Sidebar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
// import Topbar from "@/components/layout/Topbar"
import { ReactNode } from "react"


const InstructorLayout = ({children} : {children : ReactNode}) => {
    const {userId} = auth();
    if (!userId) {
        return redirect("sign-in");
    }
  return (
    // <div className="flex flex-col">
    // <Topbar/>
    <div className="flex h-full">
   <SideBar/>
   <div className="flex-1">
   {children}
   </div>
     </div> 
//  </div>
  )
}

export default InstructorLayout;