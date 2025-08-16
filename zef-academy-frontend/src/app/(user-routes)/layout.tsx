"use client";
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const UserLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo?.email) {
      router.push("/");
      return;
    }

    if (!userInfo?.isAccountVerified) {
      router.push("/auth/verifyAccount");
    }
  }, [router, userInfo]);

  // لو لسه بيعمل redirect، من الأفضل ما ترندرش الـ children
  if (!userInfo?.email || !userInfo?.isAccountVerified) {
    return null; // ممكن تحط loader هنا
  }

  return <>{children}</>;
};

export default UserLayout;
