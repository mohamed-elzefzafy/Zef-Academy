"use client";
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react'

const UserLayout = ({children} : {children : ReactNode}) => {
    const router = useRouter();
    const { userInfo } = useAppSelector((state) => state.auth);
if (!userInfo.email) {
  return router.push("/");
} 

    // useEffect(() =>{
      if (!userInfo.isAccountVerified) {
        return router.push("/auth/verifyAccount");
      }
    // },[router, userInfo.isAccountVerified])
  
  return (
  <>
  {children}
  </>
  )
}

export default UserLayout;