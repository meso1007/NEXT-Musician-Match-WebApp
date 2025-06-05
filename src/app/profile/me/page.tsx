"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, deleteObject } from "firebase/storage";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { EllipsisVertical } from "lucide-react";
import { IoMdShare } from "react-icons/io";
import { storage } from "@/firebase/config";
import MainLayout from "@/layout/MainLayout";
import { useUserStore } from "@/stores/userStore";
import { useSongStore } from "@/stores/songStore";
import Image from "next/image";
import { IoMail, IoShare } from "react-icons/io5";
import Link from "next/link";

type Song = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  coverUrl?: string;
  url?: string;
  desc?: string;
  filename: string;
};

type UserRole = "composer" | "lyricist" | "unknown";

export default function MyProfilePage() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newRole, setNewRole] = useState<UserRole[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const validRoles = ["composer", "lyricist", "unknown"] as const;
  const { user, setUser, updateUser, showEveryComp } = useUserStore();
  const { songs, fetchSongs, removeSong } = useSongStore();


  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setUser(user);
    fetchSongs(user.uid);
  }, [user]);

  const handleShare = () => {
  }

  const handleDelete = async (songId: string, filename: string) => {
    if (!user) return;
    try {
      const fileRef = ref(storage, `songs/${user.uid}/${filename}`);
      await deleteObject(fileRef);
      removeSong(songId);
      alert("削除しました！");
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    }
  };
  const showIt = () => {
    showEveryComp()
  }

  const navItems = ["User Info", "My Songs", "Settings", "Favorites"] as const;
  type NavItem = typeof navItems[number];
  const [active, setActive] = useState<NavItem>("User Info");


  if (!user) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="w-full mx-auto rounded-xl p-6">
        <header className="bg-white shadow-sm rounded-xl border-b sticky top-0 z-10 ">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex space-x-8 text-sm font-medium text-gray-700 py-2 ">
              {navItems.map((item) => (
                <li key={item} className="">
                  <button
                    onClick={() => setActive(item)}
                    className={`focus:outline-none ${active === item
                      ? "text-black border-b-2 border-lime-500 font-semibold uppercase cursor-pointer"
                      : "hover:text-lime-500 cursor-pointer"
                      }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {active === "User Info" &&
          <div className="bg-white p-4 rounded shadow pt-10 relative">
            <div className="flex justify-between items-center absolute bottom-2 right-5">
              {!editMode ? (
                <button
                  onClick={() => {
                    setEditMode(true);
                    setNewName(user.name || "");
                    setNewBio(user?.bio || "");
                    setNewRole(user?.role || []);
                  }}
                  className="text-xl text-gray-900 hover:underline uppercase cursor-pointer"
                >
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const updates = {
                          name: newName,
                          bio: newBio,
                          role: newRole.filter(
                            (r): r is typeof validRoles[number] =>
                              validRoles.includes(r as any)
                          ),
                        };

                        await updateUser(user.uid, updates);

                        alert("プロフィールを更新しました。");
                        setEditMode(false);
                      } catch (error) {
                        console.error("更新エラー:", error);
                        alert("更新に失敗しました。");
                      }
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xl cursor-pointer uppercase"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="text-xl text-gray-900 hover:underline cursor-pointer uppercase"
                  >
                    cancel
                  </button>
                </div>
              )}
            </div>

            {!editMode ? (
              <div className="w-full px-10 grid grid-cols-3">
                <div className="col-span-1">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      width={250}
                      height={250}
                      alt="プロフィール画像"
                      className="rounded-full ring-2 ring-lime-400 object-cover"
                    />
                  ) : user ? (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl text-white">
                      {user.name?.charAt(0).toUpperCase() || "G"}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl text-white">
                      G
                    </div>
                  )}
                </div>
                <div className="col-span-2 flex flex-col space-y-6 normal">
                  <div className="">
                    <p className="uppercase text-7xl">
                      {user.name || "未設定"}
                    </p>
                    <p className="text-gray-600">
                      {user.uid}
                    </p>
                  </div>
                  <div className="flex items-center gap-10">
                    <Link href={user.email} className="bg-gray-900 inline-block text-xl text-white px-3 py-2 rounded-3xl uppercase hover:bg-gray-700">
                      <div className="flex gap-2 items-center">
                        <IoMail />
                        <p>Message</p>
                      </div>
                    </Link>
                    <button onClick={handleShare} className="bg-gray-900 inline-block text-xl text-white px-3 py-2 rounded-3xl uppercase hover:bg-gray-700 cursor-pointer">
                      <div className="flex gap-2 items-center">
                        <IoShare />
                        <p>Share</p>
                      </div>
                    </button>
                  </div>
                  <div className="flex items-center gap-10 normal">
                    <p className="uppercase">
                      <strong className="text-xl">Role</strong>
                      <p className="text-5xl">{user?.role?.join(", ") || "未設定"}</p>
                    </p>
                    <p className="uppercase">
                      <strong className="text-xl">Experience</strong>
                      <p className="text-5xl">10 years</p>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-2">
                  <label className="block text-sm font-medium">ユーザー名:</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border rounded px-3 py-2 w-full mt-1"
                    placeholder="新しいユーザー名"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium">BIO:</label>
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="border rounded px-3 py-2 w-full mt-1"
                    placeholder="自己紹介など"
                  />
                </div>
                <div className="mt-2  pb-10">
                  <label className="block text-sm font-medium">
                    役割を選択してください:
                  </label>
                  <select
                    multiple
                    value={newRole}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions
                      ).map((o) => o.value as UserRole);
                      setNewRole(selected);
                    }}
                    className="border rounded px-3 py-2 w-full mt-1 font-bold uppercase"
                  >
                    <option value="composer">作曲家 (Composer)</option>
                    <option value="lyricist">作詞家 (Lyricist)</option>
                    <option value="unknown">未設定 (Unknown)</option>
                  </select>
                </div>
              </>
            )}
            {!editMode ? (<div className="grid grid-col-3 normal relative mx-10 border-2 px-10 py-16 rounded font-bold mr-30 mt-16">
              <h2 className="absolute top-2 left-2 text-3xl">My story</h2>
              <div className="col-span-2">
                {user?.bio || "未設定"}
              </div>
            </div>) : ""}
          </div>
        }


        {active === "My Songs" &&
          <div className="bg-white p-4 rounded shadow mb-6 normal ">
            <h2 className="text-3xl font-semibold mb-2">POsted Songs</h2>
            {songs.length === 0 ? (
              <p>投稿がありません。</p>
            ) : (
              <ul className="space-y-2">
                {songs.map((song) => (
                  <li
                    key={song.id}
                    className="p-4 bg-gray-100 rounded flex justify-between items-start relative"
                  >
                    <div className="w-full">
                      <p className="font-semibold">{song.title}</p>
                      <audio controls className="w-full">
                        <source src={song.url} type="audio/mp3" />
                        お使いのブラウザは audio タグをサポートしていません。
                      </audio>
                      {song.desc && (
                        <p className="text-sm text-gray-600">{song.desc}</p>
                      )}
                      <p className="text-xs text-gray-400">{song.title}</p>
                    </div>

                    <div className="relative">
                      <button
                        className="p-2 rounded-full cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setMenuOpenId(menuOpenId === song.id ? null : song.id)
                        }
                      >
                        <EllipsisVertical size={20} />
                      </button>

                      {menuOpenId === song.id && (
                        <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow z-10">
                          <button
                            onClick={() => {
                              handleDelete(song.id, song.title);
                              setMenuOpenId(null);
                            }}
                            className="flex items-center gap-1 cursor-pointer w-full text-left px-3 py-1 text-sm hover:bg-red-100"
                          >
                            <FaTrashAlt /> 削除
                          </button>
                          <button
                            onClick={() => {
                              alert("編集機能はまだ未実装です");
                              setMenuOpenId(null);
                            }}
                            className="flex items-center gap-1 cursor-pointer w-full text-left px-3 py-1 text-sm hover:bg-blue-100"
                          >
                            <FaEdit /> 編集
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        }

      </div>
    </MainLayout>
  );
}
