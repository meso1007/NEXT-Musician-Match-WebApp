"use client"; // ✅ 必須（クライアントコンポーネント）

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/firebase/users";
import UserSetupForm from "../../components/auth/UserSetupForm";
import { useRouter } from "next/navigation"; // ✅ App Router 用
import MainLayout from "@/layout/MainLayout";

export default function SetupPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/"); // 未ログインならリダイレクト
        return;
      }

    });
    return () => unsub();
  }, [router]);

  if (loading) return <p className="text-center py-10">読み込み中...</p>;
  if (!uid) return null;

  return (
    <MainLayout>
      <UserSetupForm uid={uid} />
    </MainLayout>
  );
}
