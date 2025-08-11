"use client";

import VideoPlayer from "@/assets/svg/VideoPlayer";
import VideoModal from "./VideoModal";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  videoUrl?: string;
  title?: string;
  thumbnail?: string;
};

export default function CoursePreview({ videoUrl, title, thumbnail }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative">
        <Image src={thumbnail || "/placeholder.jpg"} alt={title ? `${title} thumbnail` : "course image"} width={1280} height={270} className="w-full h-auto" />
        <div className="bg-gray-950/50 w-full h-full absolute top-0"></div>
        <button onClick={handlePlayClick} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full flex items-center justify-center hover:bg-black/20 transition-colors duration-200" aria-label="Play course preview">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200">
            <VideoPlayer />
          </div>
        </button>

        <div className="absolute bottom-4 w-full text-center mx-auto left-1/2 transform -translate-x-1/2">
          <h2 className="text-white text-lg w-full">Free Preview before enrolling</h2>
        </div>
      </div>

      <VideoModal isOpen={isModalOpen} onClose={handleCloseModal} videoUrl={videoUrl} title={title || "Course Preview"} />
    </>
  );
}
