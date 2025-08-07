"use client";

import Image from "next/image";
import React from "react";

type Props = {
  link?: string;
  className?: string;
};

export default function Avatar({ link = "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg", className }: Props) {
  return (
    <>
      <div className={`min-w-12 max-w-12 min-h-12 max-h-12 rounded-full bg-gray-300 ${className}`}>
        <Image
          className="w-12 h-12 object-cover rounded-full"
          src={link}
          alt="avatar"
          width={500}
          height={500}
          onError={() => {
            return { src: "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg", alt: "avatar", width: 500, height: 500 };
          }}
        />
      </div>
    </>
  );
}
