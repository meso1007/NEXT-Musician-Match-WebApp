"use client";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FaCircleNotch } from "react-icons/fa";

type FeatureCardProps = {
  number: number;
  title: string;
  description: string;
  bgColor: string;
};

const getBgColorClass = (bgColor: string) => {
  switch (bgColor) {
    case "yellow":
      return "bg-yellow-400";
    case "gray":
      return "bg-gray-400";
    case "black":
      return "bg-black";
    default:
      return "bg-gray-100";
  }
};

const FeatureCard: FC<FeatureCardProps> = ({
  number,
  title,
  description,
  bgColor,
}) => {
  const router = useRouter();
  const toFeaturePage = (num: number) => {
    router.push(`feature/${num}`);
  };
  return (
    <div
      className={`relative group w-80 h-96 ${getBgColorClass(
        bgColor
      )} rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100`}
    >
      <div className="absolute top-2 left-2 border px-2 rounded-xl text-gray-100 border-gray-100">
        Feature{number}
      </div>
      <div className="absolute top-2 right-2 text-gray-100"><FaCircleNotch/></div>
      <div className="absolute inset-0 flex items-center justify-center text-9xl font-extrabold text-gray-100 transition-all duration-300 group-hover:opacity-0">
        {number}
      </div>
      <button
        onClick={() => toFeaturePage(number)}
        className="absolute z-30 bottom-2 right-2 text-gray-100 text-3xl cursor-pointer hover:text-gray-400"
      >
        <IoArrowForwardCircleOutline />
      </button>

      {/* Overlay content */}
      <div className="absolute inset-0 bg-black/60 text-white p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-center">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
