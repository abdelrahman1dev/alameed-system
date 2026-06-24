"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Car,
  User,
  ArrowLeftToLine,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();

  const router = useRouter();

  const isLogin = pathname.startsWith("/login");

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLogin) return null;

  return (
    <header
      dir="rtl"
      className="
        sticky top-0 z-50
        flex items-center justify-between
        bg-blue-600 px-6 py-4
        shadow-md
      "
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/15 p-2">
          <Car
            className="text-white"
            size={28}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            مركز العميد
          </h1>

          <p className="text-sm text-blue-100">
            نظام إدارة قطع غيار السيارات
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <p className="text-sm text-blue-100">
            {new Date().toLocaleDateString(
              "ar-EG"
            )}
          </p>
        </div>

        {!user ? (
          <Link
            href="/login"
            className="
              flex items-center gap-2
              rounded-xl bg-white/10
              px-3 py-2
              transition hover:bg-white/20
            "
          >
            <User
              size={18}
              className="text-white"
            />

            <span className="text-sm text-white">
              تسجيل الدخول
            </span>
          </Link>
        ) : (
          <>
            <Link
              href="/user"
              className="
                flex items-center gap-2
                rounded-xl bg-white/10
                px-3 py-2
                transition hover:bg-white/20
              "
            >
              <User
                size={18}
                className="text-white"
              />

              <span className="text-sm text-white">
                {user.username}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="
                flex items-center gap-2
                rounded-xl bg-red-500
                px-3 py-2
                text-white
                transition hover:bg-red-600
              "
            >
              <LogOut size={18} />

              <span className="hidden md:block">
                تسجيل الخروج
              </span>
            </button>
          </>
        )}

        <Link
          href="/"
          className="
            flex items-center gap-2
            rounded-xl bg-white/10
            px-3 py-2
            transition hover:bg-white/20
          "
        >
          <ArrowLeftToLine
            size={18}
            className="text-white"
          />
        </Link>
      </div>
    </header>
  );
}