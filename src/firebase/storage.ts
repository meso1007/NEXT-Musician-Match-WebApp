import { storage, db, auth } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";


export const uploadSong = async (file: File, title: string, desc: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインが必要です");

  const timestamp = Date.now();
  const sanitizedFileName = `song-${timestamp}.mp3`;
  const fileRef = ref(storage, `songs/${user.uid}/${sanitizedFileName}`);
  console.log("現在のユーザーUID:", auth.currentUser?.uid);
  console.log("ファイルパス:", `songs/${user.uid}/${sanitizedFileName}`);


  try {
    console.log("頑張る");
    await uploadBytes(fileRef, file);
    console.log("無理ぽ");
  } catch (err) {
    console.error("uploadBytesエラー:", err);
    throw err; // 再スローして上に伝える
  }

  const url = await getDownloadURL(fileRef);

  await addDoc(collection(db, "songs"), {
    title,
    uid: user.uid,
    url,
    desc,
    filename: file.name,
    userId: user.uid,
    date: serverTimestamp(),
  });

  return url; // ← ココを追加
};


export const deleteSong = async (id: string, uid: string, filename: string) => {
  // Firestoreの曲データを削除
  await deleteDoc(doc(db, "songs", id));

  // ストレージのファイルを削除
  const fileRef = ref(storage, `songs/${uid}/${filename}`);
  await deleteObject(fileRef);
};
