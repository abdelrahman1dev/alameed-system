"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: number;

  username: string;

  role: string;
};

type AuthType = {
  user: User | null;

  loading: boolean;

  refreshSession: () => Promise<void>;

  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshSession = async () => {
    try {
      setLoading(true);

      const session =
        await window.api.auth.getSession();

      setUser(session);
    } catch (error) {
      console.error(error);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const logout = async () => {
    await window.api.auth.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        refreshSession,

        setUser,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}