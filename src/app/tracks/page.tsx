"use client";
import { useEffect, useState } from "react";
import { fetchSongs } from "@/firebase/songs";
import SongCard from "../../components/track/SongCard";
import MainLayout from "@/layout/MainLayout";

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchSongs();
      setSongs(data);
    };
    load();
  }, []);

  return (
    <MainLayout>
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">投稿された曲</h1>
        <div className="grid gap-6 max-w-3xl mx-auto">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </main>
    </MainLayout>
  );
}
