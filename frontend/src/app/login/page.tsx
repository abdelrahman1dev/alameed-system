"use client";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const user =
      await window.api.auth.login(
        username,
        password
      );

    if (!user) {
      toast.error(
        "اسم المستخدم أو كلمة المرور غير صحيحة"
      );

      return;
    }

    setUser(user);

    toast.success("تم تسجيل الدخول");

    router.replace("/");
  }


return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">مركز العميد</h1>

        <p className="text-slate-600">
          مرحباً مدير النظام في نظام إدارة مركز العميد
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            اسم المستخدم
          </label>

          <input
            type="password"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            كلمة المرور
          </label>

          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  </div>
);
}

export default Page;
