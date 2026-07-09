"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);



  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center">جاري التحميل...</div>;
  }

  if (!user) {
    return null;
  }

  return children;
}
