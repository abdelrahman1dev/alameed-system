"use client";

import { Toaster } from "sonner";

import { AuthProvider } from "./AuthContext";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}