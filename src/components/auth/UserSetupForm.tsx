"use client";

import { useState } from "react";
import { saveUser } from "@/firebase/users";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserSetupForm({ uid }: { uid: string }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);

  const rawRole = searchParams.get("role");
  const validRoles = ["composer", "lyricist"] as const;
  const role: ("composer" | "lyricist" | "unknown")[] = validRoles.includes(rawRole as any)
    ? [rawRole as "composer" | "lyricist"]
    : ["unknown"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUser(uid, { name, bio, role });
    router.push("/tracks");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">プロフィールを登録</h2>
      <input
        type="text"
        placeholder="ニックネーム"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        placeholder="自己紹介"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full border p-2 rounded"
        rows={3}
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
        登録
      </button>
    </form>
  );
}
