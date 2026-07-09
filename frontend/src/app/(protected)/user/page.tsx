"use client";

import { useAuth } from "@/context/AuthContext";
import {
  User,
  Shield,
  Calendar,
} from "lucide-react";

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        لا يوجد مستخدم مسجل الدخول
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-3xl p-6"
    >
      <div className="rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-[#dbeafe] p-6">
            <User
              size={48}
              className="text-[#1447e6]"
            />
          </div>

          <h1 className="text-3xl font-bold text-[#1d293d]">
            {user.username}
          </h1>

          <div className="rounded-full bg-[#dcfce7] px-4 py-1">
            <span className="font-medium text-[#166534]">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-5">
            <div className="mb-3 flex items-center gap-3">
              <User className="text-[#1447e6]" />

              <h3 className="font-semibold">
                اسم المستخدم
              </h3>
            </div>

            <p className="text-[#45556c]">
              {user.username}
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="mb-3 flex items-center gap-3">
              <Shield className="text-[#1447e6]" />

              <h3 className="font-semibold">
                الصلاحية
              </h3>
            </div>

            <p className="text-[#45556c] ">
              {user.role}
            </p>
          </div>

          <div className="rounded-2xl border p-5 md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <Calendar className="text-[#1447e6]" />

              <h3 className="font-semibold">
                آخر تسجيل دخول
              </h3>
            </div>

            <p className="text-[#1d293d]">
              {new Date().toLocaleString(
                "ar-EG"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}