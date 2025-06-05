"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { GiFallingStar } from "react-icons/gi";
import Image from "next/image";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaMusic,
} from "react-icons/fa";
import { RiFolderUploadFill } from "react-icons/ri";
import { MdLibraryMusic } from "react-icons/md";
import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
export default function Sidebar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [offiUser] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(true);
  const userInfo = useUserStore((state) => state.user);
  const { user, updateUser } = useUserStore();

useEffect(() => {
    if (offiUser?.uid && offiUser?.photoURL) {
      updateUser(offiUser.uid, { photoURL: offiUser.photoURL });
    }
  }, [offiUser?.photoURL]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      useUserStore.getState().setUser(null);

      router.push("/auth/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  const moveToProfile = () => {
    router.push("/profile/me");
  };
  if (!isOpen) return null
  return (
    <aside className="h-screen w-70 bg-[#0f172a] text-white p-5 flex flex-col justify-between fixed top-0 left-0 shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-9 right-3 text-gray-100 hover:text-lime-500 text-2xl cursor-pointer"
        aria-label="Close sidebar"
      >
        <LuPanelLeftClose />
      </button>
      <div className="mt-3">
        <h2 className="text-2xl font-bold mb-8 text-lime-400 tracking-wide flex items-center gap-3">
          <MdLibraryMusic /> Lyriconnect
        </h2>
        <nav className="space-y-5 text-xl font-medium">
          <Link
            href="/"
            className="hover:bg-lime-500 px-4 py-2 rounded transition flex items-center gap-3"
          >
            <FaHome /> HOME
          </Link>
          <Link
            href="/tracks"
            onClick={(e) => {
              if (!offiUser) e.preventDefault();
            }}
            className={`px-4 py-2 rounded transition flex items-center gap-3 ${offiUser ? "hover:bg-lime-500 cursor-pointer" : "cursor-not-allowed text-gray-400"
              }`}          >
            <FaMusic /> BROWSE SONGS
          </Link>
          <Link
            href="/tracks/upload"
            onClick={(e) => {
              if (!offiUser) e.preventDefault();
            }}
            className={`px-4 py-2 rounded transition flex items-center gap-3 ${offiUser ? "hover:bg-lime-500 cursor-pointer" : "cursor-not-allowed text-gray-400"
              }`}          >
            <RiFolderUploadFill /> UPLOAD MUSIC
          </Link>
          <Link
            href="/profile/me"
            onClick={(e) => {
              if (!offiUser) e.preventDefault();
            }}
            className={`px-4 py-2 rounded transition flex items-center gap-3 ${offiUser ? "hover:bg-lime-500 cursor-pointer" : "cursor-not-allowed text-gray-400"
              }`}          >
            <FaUser /> PROFILE
          </Link>

          {!offiUser ? (
            <Link
              href="/auth/login"
              className="hover:bg-lime-500 px-4 py-2 rounded transition flex items-center gap-3"
            >
              <FaSignInAlt /> LOGIN
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-left bg-transparent cursor-pointer hover:bg-red-600 hover:text-white px-4 py-2 rounded transition flex items-center gap-3"
            >
              <FaSignOutAlt /> LOGOUT
            </button>
          )}
        </nav>
      </div>

      <div className="w-full mb-3">
        <div className="w-full border-t border-[#334155]"></div>
        <button
          onClick={() => {
            if (offiUser) {
              moveToProfile();
            } else {
              router.push("/auth/login");
            }
          }}
          className="w-full px-2 mt-6 rounded py-2 flex items-center gap-3 space-x-3 cursor-pointer hover:bg-lime-400 transition"
        >
          {offiUser?.photoURL ? (
            <Image
              src={offiUser.photoURL}
              width={40}
              height={40}
              alt="プロフィール画像"
              className="rounded-full ring-2 ring-lime-400"
            />
          ) : userInfo ? (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl text-white">
              {userInfo.name?.charAt(0).toUpperCase() || "G"}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl text-white">
              G
            </div>
          )}

          <div className="text-left">
            <div className="text-sm uppercase text-gray-200">{userInfo?.role?.join(", ") || "unknown"}</div>
            <div className="text-2xl font-semibold uppercase">
              {userInfo?.name || "ゲスト"}
            </div>
          </div>
        </button>

        <button className="w-full cursor-pointer mt-5 bg-lime-500 flex p-2 rounded-xl items-center justify-center gap-1 text-2xl hover:bg-lime-600">
          <GiFallingStar />
          <h4 className="text-lg font-bold normal">Plusにアップグレード</h4>
        </button>
      </div>
    </aside>
  );
}
