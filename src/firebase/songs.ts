import { db } from "./config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const fetchSongs = async () => {
  const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
