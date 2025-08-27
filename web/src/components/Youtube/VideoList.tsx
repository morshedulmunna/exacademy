import React from "react";
import Image from "next/image";

type Video = {
  title: string;
  date: string;
  description: string;
  url: string;
  thumbnail: string;
};

type VideoListProps = {
  videos: Video[];
};

export default function VideoList({ videos }: VideoListProps) {
  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Latest Youtube Videos</h2>
          <div className="flex items-center gap-4 mb-10 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              255K subscribers
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15V6" />
                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M12 12H3" />
                <path d="M16 6H3" />
                <path d="M12 18H3" />
              </svg>
              427 videos
            </div>
          </div>
        </div>

        <button className=" bg-red-500 text-sm px-2 py-1 font-medium rounded">Subscribe Youtube</button>
      </div>

      <div className="space-y-8">
        {videos.map((video, index) => (
          <a key={index} href={video.url} target="_blank" rel="noopener noreferrer" className="block group transition-colors rounded-lg p-2 -m-2">
            <div className="grid md:grid-cols-[200px,1fr] gap-4">
              <div className="relative border rounded border-gray-50/10 group-hover:border-cyan-400/20 duration-300 transition-colors h-32 overflow-hidden">
                <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-7 bg-red-600 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-1 group-hover:text-cyan-400 transition-colors duration-300 text-lg">{video.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-400 transition-colors duration-300 text-sm mb-2">{video.date}</p>
                <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-400 transition-colors duration-300">{video.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
