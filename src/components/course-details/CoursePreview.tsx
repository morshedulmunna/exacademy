import VideoPlayer from "@/assets/svg/VideoPlayer";
import Image from "next/image";
import React from "react";

type Props = object;

export default function CoursePreview({}: Props) {
  return (
    <>
      <div className="relative">
        <Image
          src={
            "https://wsrv.nl/?url=https%3A%2F%2Fs3.us-east-1.amazonaws.com%2Fcreator-assets.codedamn.com%2Fpiyushgargdev-6320712b0abc1d00093a9773%2FCOURSE_IMAGE%2F2024-01-27%2Ffd7ae5365e95e4810eeefd7380de3211b76e8836&w=1280&q=82&output=webp"
          }
          alt="course image"
          width={1280}
          height={270}
          className="w-full h-auto"
        />
        <div className="bg-gray-950/50 w-full h-full absolute top-0"></div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full flex items-center justify-center">
          <VideoPlayer />
        </div>

        <div className="absolute bottom-4 w-full text-center mx-auto left-1/2 transform -translate-x-1/2">
          <h2 className="text-white text-lg w-full">
            Free Preview before enrolling
          </h2>
        </div>
      </div>
    </>
  );
}
