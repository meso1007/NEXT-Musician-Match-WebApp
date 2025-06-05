"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeatureCard from "@/components/layout/FeatureCard";
import { motion } from "framer-motion";

export default function Hero() {
  const [activeRole, setActiveRole] = useState<"composer" | "lyricist" | null>(
    null
  );
  const router = useRouter();

  const openForm = (role: "composer" | "lyricist") => {
    setActiveRole(role);
  };

  const goToFormPage = () => {
    if (activeRole) router.push(`/auth/login?role=${activeRole}`);
  };

  gsap.registerPlugin(ScrollTrigger);

  const [user] = useAuthState(auth);

  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // アニメーション対象のrefを複数用意
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    sectionRefs.forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%", // 画面の80%までスクロールしたら発火
              toggleActions: "play none none none", // 一回だけ実行
            },
          }
        );
      }
    });
  }, []);

  useEffect(() => {
    // 連続でタイムラインにアニメーション追加
    const tl = gsap.timeline();

    if (
      heroTitleRef.current &&
      heroSubtitleRef.current &&
      heroButtonRef.current
    ) {
      tl.from(heroTitleRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.8,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          heroSubtitleRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        ) // 前のアニメーションの途中で開始
        .from(
          heroButtonRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.9,
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.3"
        );
    }
  }, []);

  return (
    <div>
      <div className="relative w-full h-screen overflow-hidden">
        {/* 背景画像 */}
        <Image
          src="/images/hero-img-light.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />

        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute text-7xl logo  text-gray-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Lyriconect
        </div>

        <div className="absolute inset-0 z-20 flex">
          {/* 左半分（作詞家） */}

          {/* 右半分（作曲家） */}
          <div
            className="w-1/2 h-full cursor-pointer relative group"
            onClick={() => openForm("composer")}
          >
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-5xl">Composer</p> <br />
                <span>-作曲家として始める</span>
              </div>
            </div>
          </div>
          <div
            className="w-1/2 h-full cursor-pointer relative group"
            onClick={() => openForm("lyricist")}
          >
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-5xl">Lyricist</p> <br />{" "}
                <span>-作詞家として始める</span>
              </div>
            </div>
          </div>
        </div>

        {activeRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute top-0 bottom-0 w-1/2 flex flex-col justify-center gap-16 z-30 p-10 text-white ${
              activeRole === "composer" ? "right-0" : "left-0"
            }`}
            style={{
              backgroundColor: "#1a1a1a",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {activeRole === "composer" ? "COMPOSER" : "LYRICIST"}
              </p>
              <h2 className="text-3xl font-bold mb-4 border-b pb-2">
                {activeRole === "composer"
                  ? "作曲家として始めよう"
                  : "作詞家として始めよう"}
              </h2>
            </div>
            <div className="absolute top-45 right-10">
              {activeRole === "composer" ? (
                <Image
                  src="/images/composer.svg"
                  alt="composer"
                  width={200}
                  height={200}
                />
              ) : (
                <Image
                  src="/images/lyricist.svg"
                  alt="composer"
                  width={200}
                  height={200}
                />
              )}
            </div>
            <ul className="list-disc list-inside font-semibold text-xl md:text-xl text-gray-200 space-y-8 mb-6">
              {activeRole === "composer" ? (
                <>
                  <li>直感的なインターフェースでスムーズに作曲</li>
                  <li>他のアーティストとのコラボ機能</li>
                  <li>インスピレーションを刺激する音源ライブラリ</li>
                  <li>自動コード提案機能でスピードアップ</li>
                  <li>あなたの作品がプロデューサーの目に触れるチャンス</li>
                </>
              ) : (
                <>
                  <li>自然に言葉が浮かぶリリック専用エディタ</li>
                  <li>韻やテンポを可視化する高度なツール</li>
                  <li>AIによるフィードバックで表現力アップ</li>
                  <li>テーマに沿ったリリックサンプルでインスパイア</li>
                  <li>作品投稿で即フィードバックを獲得</li>
                </>
              )}
            </ul>
            <div className="flex flex-col gap-6">
              <button
                onClick={goToFormPage}
                className="bg-white text-black px-6 py-3 mt-10 rounded font-semibold hover:bg-gray-300 transition cursor-pointer"
              >
                {activeRole === "composer"
                  ? "ユーザー登録へ進む"
                  : "ユーザー登録へ進む"}
              </button>

              <button
                onClick={() => setActiveRole(null)}
                className="ml-4 text-base text-gray-400 mb-2 underline hover:text-white cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        )}
      </div>
      <section ref={sectionRefs[0]} className="h-screen py-16 bg-[#1a1a1a]">
        <div className="ml-20 text-gray-100 mb-20">
          <h2 className="text-6xl border-b inline">What We Offer</h2>
          <h3 className="text-4xl mt-6">主要機能</h3>
        </div>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            bgColor="yellow"
            number={1}
            title="役割に特化したマッチング"
            description="作詞家・作曲家として、専門分野でコラボ相手を見つけやすくします。"
          />
          <FeatureCard
            bgColor="gray"
            number={2}
            title="シンプルで直感的なUI"
            description="作品投稿も検索も簡単。創作に集中できる設計です。"
          />
          <FeatureCard
            bgColor="black"
            number={3}
            title="作品からつながる"
            description="プロフィールよりも音楽で判断。あなたの作品が出会いの入口になります。"
          />
        </div>
      </section>
      <section
        ref={sectionRefs[1]}
        className="bg-gray-800 text-white py-24 px-6"
      >
        <h2 className="text-4xl font-extrabold text-center mb-16 tracking-wide">
          ユーザーの声
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-gray-700 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              「最初は友達に勧められて始めましたが、使ってみて驚いたのは、アップした曲への反応の早さと温かさです。SNS感覚で作品を共有できて、気軽に自分の世界を広げられる場所だと感じました。いまでは週に1〜2曲アップして、ファンとのコミュニケーションも楽しんでいます。」
            </p>
            <p className="text-lime-400 font-semibold text-sm">
              ― Yui / ボーカリスト
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              「ギターを使ったトラック制作が趣味で、これまでは公開の場がなく一人で完結していました。このプラットフォームで初めて他のクリエイターに声をかけてもらって、一緒に曲を完成させるという体験ができました。コメント欄やDMでのやり取りが制作のモチベーションにもつながっています。」
            </p>
            <p className="text-lime-400 font-semibold text-sm">
              ― Daichi / トラックメイカー
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              「プロフィールページを通じて、自分の音楽スタイルやルーツを自由に表現できるのが魅力です。これまでの実績や参加したイベント、制作環境なども載せられるので、自分の音楽名刺としても使っています。今後はリスナーや仕事の依頼にもつながると期待しています。」
            </p>
            <p className="text-lime-400 font-semibold text-sm">
              ― Nao / DJ・作曲家
            </p>
          </div>
        </div>
      </section>

      <section
        ref={sectionRefs[2]}
        className="bg-[#213448] text-white py-20 px-6"
      >
        <h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-lime-400">
              Q. 登録は無料ですか？
            </h3>
            <p className="text-gray-300">
              はい、基本機能はすべて無料でお使いいただけます。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-lime-400">
              Q. コラボはどうやって始めるの？
            </h3>
            <p className="text-gray-300">
              気になるユーザーのプロフィールから「コラボリクエスト」を送れます。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-lime-400">
              Q. 楽曲の著作権は？
            </h3>
            <p className="text-gray-300">
              投稿された楽曲の著作権は投稿者に帰属します。安心してご利用ください。
            </p>
          </div>
        </div>
      </section>
      <section
        ref={sectionRefs[3]}
        className="bg-gray-800 text-white py-16 px-6 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">さあ、音楽でつながろう。</h2>
        <p className="text-gray-300 mb-8">
          今すぐはじめて、あなたの音楽を世界に届けましょう。
        </p>
        <Link
          href={user ? "/tracks" : "/auth/login"}
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 px-8 rounded-xl transition"
        >
          {user ? "楽曲を見る" : "無料ではじめる"}
        </Link>
      </section>
    </div>
  );
}
