"use client"
import { FaUser } from "react-icons/fa";
import { getUser } from "@/firebase/users";
import { useEffect, useState } from "react";

type Song = {
  id: string;
  title: string;
  url: string;
  desc: string;
  userId: string;
};

export default function SongCard({ song }: { song: Song }) {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserName = async () => {
      const userData = await getUser(song.userId);
      if (userData && userData.name) {
        setUserName(userData.name);
      } else {
        setUserName("名無し");
      }
    };
    fetchUserName();
  }, [song.userId]);
  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 pl-8 border-2 border-gray-400">
      {/* 左側のアクセントライン */}
      <div className="absolute top-4 left-0 h-[85%] w-1.5 bg-lime-400 rounded-r-xl"></div>

      {/* タイトル */}
      <h3 className="text-xl font-bold flex items-center text-gray-800 mb-2">
        {song.title}
      </h3>

      {/* オーディオプレイヤー */}
      <div className="rounded-md overflow-hidden">
        <audio controls src={song.url} className="w-full" />
      </div>

      {/* 説明 */}
      {song.desc && (
        <p className="text-gray-700 text-sm mt-3 leading-relaxed p-3 rounded-xl border border-lime-500">
          <span className="text-lime-500 font-medium mr-2">説明: </span>
          {song.desc}
        </p>
      )}

      {/* 投稿者情報 */}
      <div className="flex items-center text-sm text-gray-600 bg-lime-50 border border-lime-200 rounded-md px-3 py-1 w-fit mt-4">
        <FaUser className="mr-2 text-lime-400" />
        <span className="font-medium">投稿者: {userName}</span>
      </div>
    </div>
  );
}
