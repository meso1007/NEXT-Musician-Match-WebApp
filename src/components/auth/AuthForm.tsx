"use client";
import { useEffect, useState } from "react";
import { login, signup, googleLogin } from "@/firebase/auth";
import Image from "next/image";
import { saveUser } from "@/firebase/users";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config"
import { useUserStore } from "@/stores/userStore";
import { useAuthState } from "react-firebase-hooks/auth";


export default function AuthPage() {
  const [offiUser] = useAuthState(auth)
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get("role");
  const [showPassword, setShowPassword] = useState(false);
  const role = (roleParam === "composer" || roleParam === "lyricist") ? roleParam : "unknown";


  const roleTitle = role === "lyricist"
    ? "作詞家として"
    : role === "composer"
      ? "作曲家として"
      : "ログイン";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);

        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = docSnap.data();
          if (userData) {
            useUserStore.getState().setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "名無し",
              email: firebaseUser.email || "",
              bio: userData.bio ?? "",
              role: userData.role ?? ["unknown"],
              photoURL: typeof offiUser?.photoURL === "string" ? offiUser.photoURL : undefined
            });
          }
        }
      } else {
        const userCredential = await signup(email, password);
        const newUser = {
          name: userCredential.user.displayName || "名無し",
          bio: "",
          role: [(role as "composer" | "lyricist" | "unknown") || "unknown"],
        };
        await saveUser(userCredential.user.uid, newUser);

        // ✅ Zustand にも保存
        useUserStore.getState().setUser({
          uid: userCredential.user.uid,
          name: newUser.name,
          email: userCredential.user.email || "",
          bio: newUser.bio,
          role: newUser.role,
        });
      }

      router.push("/tracks");
    } catch (err: any) {
      alert(err.message);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const user = await googleLogin();

      // 🔍 既存ユーザーの確認
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // ✅ 新規ユーザーのみ保存
        const newUser = {
          name: user.displayName || "名無し",
          bio: "",
          role: [(role as "composer" | "lyricist" | "unknown") || "unknown"],
        };
        await saveUser(user.uid, newUser);

        // Zustand に保存
        useUserStore.getState().setUser({
          uid: user.uid,
          name: newUser.name,
          email: user.email || "",
          bio: newUser.bio,
          role: newUser.role,
        });
      } else {
        // ✅ 既存ユーザーなら Firestore から読み込んで Zustand に保存
        const userData = docSnap.data();
        useUserStore.getState().setUser({
          uid: user.uid,
          name: user.displayName || "名無し",
          email: user.email || "",
          bio: userData.bio ?? "",
          role: userData.role ?? ["unknown"],
        });
      }


      router.push("/tracks");
    } catch (err: any) {
      alert(err.message);
    }
  };


  return (
    <div className="flex z-20 max-w-1/2 rounded-2xl items-center justify-center bg-gray-100">
      <div className="flex w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="w-full p-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold">Welcome Back to LYRICONNECT!</h3>
            <p className="font-bold text-gray-600">Please enter your details to sign in your account</p>
            <h2 className="text-2xl font-bold my-6 flash-title">
              {isLogin ? "LOGIN" : "REGISTER"}
            </h2>
          </div>
          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex bg-transparent itemd-center text-lg justify-center gap-2 border border-gray-400 text-gray-900 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              <Image alt="apple logo" src="/images/apple.png" width={30} height={30} />
              Continue with Apple
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex bg-transparent itemd-center text-lg justify-center gap-2 border border-gray-400 text-gray-900 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              <Image alt="apple logo" src="/images/google.png" width={30} height={30} />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-grow h-px bg-gray-800" />
              <div className="text-gray-800 text-sm whitespace-nowrap">Or Sign in With</div>
              <div className="flex-grow h-px bg-gray-800" />
            </div>

            <div className="flex flex-col font-bold">
              <label htmlFor="email" className="text-midium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="john1234@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col font-bold relative">
              <label htmlFor="password" className="text-midium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="minimum 8 character"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 rounded pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/6 mt-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button className="w-full bg-lime-500 text-white p-2 mt-4 font-bold rounded hover:bg-lime-600 cursor-pointer">
              {isLogin ? (
                <div className="flex items-center justify-center gap-1">
                  <p>ログインする</p>
                  <FaArrowRightLong />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <p>登録する</p>
                  <FaArrowRightLong />
                </div>
              )}
            </button>
            <div className="w-full flex items-center justify-center gap-1">
              <p>{isLogin ? "初めての方は" : "すでにアカウントをお持ちの方は"}</p>
              <p
                className="text-sm text-center cursor-pointer text-blue-600 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "アカウント作成" : "ログイン"}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
