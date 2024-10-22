"use client";
import { BarChart4, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const SideBar = () => {
    const pathName = usePathname();
    const sidebarRoutes = [
        { icon: <MonitorPlay />, label: "Courses", path: "/instructor/courses" },
        { icon: <BarChart4 />,label: "Performance",path: "/instructor/performance"},
      ];
  return (
    <div className="max-sm:hidden flex flex-col w-64 border-r shadow-md px-3 my-4 text-sm gap-4 font-medium">
        {sidebarRoutes.map(route => 
<Link key={route.path} href={route.path} 
className={`flex items-center gap-4 py-2 ps-1 rounded-sm ${pathName.startsWith(route.path) && "bg-[#FDAB04] dark:text-black"} `}>
{route.icon} {" "} {route.label}
</Link>

        )}
    </div>
  )
}

export default SideBar;