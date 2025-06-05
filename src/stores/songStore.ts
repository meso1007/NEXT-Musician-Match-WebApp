import { create } from 'zustand';
import { collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import type { Song } from '@/types';

type SongStore = {
    songs: Song[];
    uploading: boolean;

    setSongs: (songs: Song[]) => void;
    addSong: (song: Song) => void;
    removeSong: (songId: string) => void;

    fetchSongs: (uid: string) => Promise<void>;
    uploadSong: (file: File, title: string, desc: string, uid: string) => Promise<void>;
};

export const useSongStore = create<SongStore>((set, get) => ({
    songs: [],
    uploading: false,

    setSongs: (songs) => set({ songs }),
    addSong: (song) => set((state) => ({ songs: [...state.songs, song] })),
    removeSong: (songId) =>
        set((state) => ({
            songs: state.songs.filter((song) => song.id !== songId),
        })),

    fetchSongs: async (uid) => {
        try {
            const q = query(collection(db, 'songs'), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);
            const songs: Song[] = [];
            querySnapshot.forEach((doc) => {
                songs.push({
                    ...(doc.data() as Song),
                    id: doc.id,
                });
            });
            set({ songs });
        } catch (error) {
            console.error("fetchSongsエラー:", error);
        }
    },

    uploadSong: async (file, title, desc, userId) => {
        set({ uploading: true });
        try {
            // 1. Storageにアップロード
            const storageRef = ref(storage, `songs/${userId}/${file.name}-${Date.now()}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            // 2. Firestoreに曲情報保存
            const docRef = await addDoc(collection(db, 'songs'), {
                userId,
                title,
                desc,
                url,
                createdAt: Timestamp.now(),
            });

            // 3. Zustandのsongsに追加
            const newSong: Song = {
                id: docRef.id,
                userId,
                title,
                desc,
                url,
                createdAt: Timestamp.now(), // ← FirestoreのTimestampを使う
            };
            get().addSong(newSong);
        } catch (error) {
            console.error("uploadSongエラー:", error);
            throw error;
        } finally {
            set({ uploading: false });
        }
    },
}));
