import { db } from "./config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
type UserInfo = {
  name: string;
  bio: string;
  role: ("composer" | "lyricist" | "unknown")[];
};


export const saveUser = async (
  uid: string,
  data: { name: string; bio: string; role: ("composer" | "lyricist" | "unknown")[];
}
) => {
  await setDoc(doc(db, "users", uid), data);
};

export const getUser = async (uid: string): Promise<UserInfo | null> => {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserInfo;
};

export const updateUser = async (uid: string, data: Partial<UserInfo>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};