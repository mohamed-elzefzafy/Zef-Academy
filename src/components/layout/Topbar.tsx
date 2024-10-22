import Image from "next/image";
import Link from "next/link";
import logo from "../../resources/logo.png"
import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { auth } from "@clerk/nextjs/server";
import { Button } from "../ui/button";


const Topbar = () => {

  const topRoutes = [
    { label: "Instructor", path: "/instructor/courses" },
    { label: "Learning", path: "/learning" },
  ];
const {userId} = auth();
  return (
    <div className="flex flex-row justify-between items-center p-4">
      <Link href="/">
      <Image src={logo} alt="logo" width={100} height={100}/>
      </Link>

      <div className="max-md:hidden w-[400px] rounded-full flex">
        <input placeholder="Search for courses..."
         className="bg-[#FDAB04]/30 flex-grow dark:bg-[#FDAB04] pl-4 py-3 flex text-sm border-none 
         outline-none rounded-l-full placeholder-gray-600 font-semibold"/>
        <button className="bg-[#FDAB04] py-3 rounded-r-full px-4"> <Search size="15px" /> </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="max-sm:hidden flex space-x-2 ">
         {topRoutes.map(route => 
        <Link href={route.path} key={route.path} className="font-medium hover:text-[#FDAB04]">{route.label}</Link> 
        )}
        </div>
        <ModeToggle/>
  {userId ?     <UserButton/> :  <Link href="/sign-in"> <Button className="dark:text-black">Sign-in </Button> </Link>}
 
      </div>


    </div>
  )
}

export default Topbar;