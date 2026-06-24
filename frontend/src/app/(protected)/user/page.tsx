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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-blue-100 p-6">
            <User
              size={48}
              className="text-blue-600"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            {user.username}
          </h1>

          <div className="rounded-full bg-green-100 px-4 py-1">
            <span className="font-medium text-green-700">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-5">
            <div className="mb-3 flex items-center gap-3">
              <User className="text-blue-600" />

              <h3 className="font-semibold">
                اسم المستخدم
              </h3>
            </div>

            <p className="text-slate-600">
              {user.username}
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="mb-3 flex items-center gap-3">
              <Shield className="text-blue-600" />

              <h3 className="font-semibold">
                الصلاحية
              </h3>
            </div>

            <p className="text-slate-600">
              {user.role}
            </p>
          </div>

          <div className="rounded-2xl border p-5 md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <Calendar className="text-blue-600" />

              <h3 className="font-semibold">
                آخر تسجيل دخول
              </h3>
            </div>

            <p className="text-slate-600">
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