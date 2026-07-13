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
  <div className="min-h-screen flex items-center justify-center bg-opacity">
    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border  p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">مركز العميد</h1>

        <p className="text-[#45556c]">
          مرحباً مدير النظام في نظام إدارة مركز العميد
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#314158]">
            اسم المستخدم
          </label>

          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full rounded-lg border border-[#cad5e2] px-4 py-3 outline-none transition focus:border-foreground focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#314158]">
            كلمة المرور
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            className="w-full rounded-lg border border-[#cad5e2] px-4 py-3 outline-none transition focus:border-foreground focus:ring-2 focus:ring-[#155dfc]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-foreground py-3 font-semibold text-white transition hover:bg-[#1447e6]"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  </div>
);
}

export default Page;
