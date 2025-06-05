# 🎼 Song Match - A Platform Connecting Composers and Lyricists

**Song Match** is a platform that connects composers and lyricists, enabling them to collaborate and bring music to life.  
Users can share their works, connect with one another, and accelerate their creative process.

---

## 🌟 Key Features

- 🔐 User registration / Login / Logout (via Firebase Authentication)
- 🧑‍💼 Profile editing
- 🎵 Upload and manage songs
- 📄 View other users' profiles
- 📨 **Direct Messaging** (planned)
- 💬 **Commenting** (planned)

---

## 💻 Tech Stack

| Tech        | Description |
|-------------|-------------|
| **Next.js 15**     | React-based framework (using App Router or Pages Router) |
| **TypeScript**     | For type-safe, scalable development |
| **Tailwind CSS**   | Modern, responsive UI styling |
| **Firebase**       | Authentication, Firestore database, and storage |
| **Turbopack**      | Fast dev bundler (can be replaced with Webpack)

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/song-match.git
cd song-match
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Set Up Firebase Configuration
Create a .env.local file in the root directory and include your Firebase project credentials:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server
```bash
npm run dev
``` 
