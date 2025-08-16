"use client";
import { ReactNode } from 'react';
import {  Dashboard, LocalLibrary, School} from '@mui/icons-material';
import { Box } from '@mui/material';
import DrawerComponent from './_components/DrawerComponent';




const InstructorDashboardLayout = ({ children }: { children: ReactNode }) => {


  const InstructorDashboardArrayList = [
  { text:"dashboard", icon: <Dashboard />, path: "/instructor-dashboard" },
  { text: "courses", icon: <School/>, path: "/instructor-dashboard/courses" },
  { text: "lectures", icon: <LocalLibrary />, path: "/instructor-dashboard/lectures" }

];


  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
  <DrawerComponent drawerOptions={InstructorDashboardArrayList} />

  <Box
    component="main"
    sx={{
      flexGrow: 1,            // this makes sure the main content takes remaining space
      overflowX: 'hidden',    // optional: prevents horizontal scroll
      overflowY: 'auto',      // optional: allow vertical scrolling
      maxWidth: '100%',       // prevents growing too wide
    }}
  >
    {children}
  </Box>
</Box>

  );
};

export default InstructorDashboardLayout;