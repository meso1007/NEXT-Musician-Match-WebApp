export type UserRole = "composer" | "lyricist" | "unknown";
import { Timestamp } from 'firebase/firestore';

export interface UserInfo {
  name: string;
  bio: string;
  role: UserRole[];
}


export type Song = {
  title: string;
  desc: string;
  url: string;
  userId: string;
  id: string;
  createdAt: Timestamp;
};