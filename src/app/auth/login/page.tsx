"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebase/config";
import MainLayout from "@/layout/MainLayout";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get("role");
  const role = (roleParam === "composer" || roleParam === "lyricist") ? roleParam : "unknown";

  useEffect(() => {
    if (user) {
      router.push("/tracks");
    }
  }, [user, router]);

  if (loading) {
    return (
      <MainLayout>
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
          <p>読み込み中...</p>
        </main>
      </MainLayout>
    );
  }

  if (user) {
    return null;
  }

  return (
    <MainLayout>
      <main className="relative h-screen w-full bg-[url('/images/login-img.png')] bg-cover bg-center flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <AuthForm />
      </main>
    </MainLayout>
  );
}
