"use client";

import { useState, useRef, useEffect } from "react";
import { useSongStore } from "@/stores/songStore"; // zustandのパスに合わせてください
import { auth } from "@/firebase/config";
import gsap from "gsap";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [showMp3Card, setShowMp3Card] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mp3CardRef = useRef<HTMLDivElement>(null);

  // zustandからuploadSong関数とuploading状態を取得
  const uploadSong = useSongStore((state) => state.uploadSong);
  const uploading = useSongStore((state) => state.uploading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      alert("ログインしてください");
      return;
    }

    try {
      // zustandのuploadSong呼び出しにuser.uidを渡す
      await uploadSong(file, title, desc, user.uid);

      // Firestoreに保存後、Zustandのsongsに追加されているので
      // ここではStorageのURLだけ取得して表示するために、songsから最新曲を探すのもありですが
      // シンプルにshowMp3Cardを表示してファイルのURLはZustand側のsongsから取る実装でもOK
      // 今回はURLだけ直接stateにセットしとく簡単版にします

      // もしuploadSongがURLを返すように変更していなければ、
      // zustandにURL保持用stateを足すか、ここは適宜調整してください

      // いったんURLはsetAudioUrl(null)でリセット
      setAudioUrl(null);
      setShowMp3Card(true);
      setFile(null);
      setTitle("");
      setDesc("");
      alert("アップロード完了！");
    } catch (err: any) {
      console.error("アップロード失敗", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (showMp3Card && mp3CardRef.current) {
      gsap.fromTo(
        mp3CardRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, [showMp3Card]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-lime-300 shadow-xl rounded-2xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-lime-600 border-b pb-2">
          🎧 曲の投稿
        </h2>

        <input
          type="text"
          placeholder="🎵 曲のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-lime-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
          required
        />

        <input
          type="file"
          accept=".mp3"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold
          file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
          required
        />

        <textarea
          placeholder="📝 曲の説明（任意）"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border border-lime-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
          rows={3}
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-lg transition duration-300 cursor-pointer"
        >
          {uploading ? "アップロード中..." : "🎤 アップロード"}
        </button>
      </form>

      {showMp3Card && (
        <div
          ref={mp3CardRef}
          className="mt-6 p-6 bg-emerald-50/80 backdrop-blur-md border border-emerald-200 shadow-md rounded-xl text-center"
        >
          <p className="text-xl font-semibold text-emerald-700 mb-2">
            🎶 {title}
          </p>
          <p className="text-sm text-emerald-800 italic">
            {desc || "（説明なし）"}
          </p>

          {/* audioUrlをzustandのsongsから取得するならここを変更 */}
          {audioUrl && (
            <audio controls src={audioUrl} className="mt-4 w-full rounded-md">
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </div>
  );
}
