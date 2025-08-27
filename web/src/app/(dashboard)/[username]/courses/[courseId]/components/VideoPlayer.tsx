import React, { useState } from "react";
import { Play, Clock, BookOpen } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  description: string;
  duration: string;
  moduleCount: number;
}

/**
 * Video player component with enhanced UI and controls
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ title, description, duration, moduleCount }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      <div className="relative z-10 text-center p-8">
        {!isVideoPlaying ? (
          <>
            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 hover:bg-white/30 transition-all duration-300 cursor-pointer group mx-auto">
              <Play className="w-14 h-14 text-white ml-1 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h2 className="text-white text-3xl font-bold mb-3">{title}</h2>
            <p className="text-gray-300 text-lg mb-4">{description}</p>
            <div className="flex items-center justify-center space-x-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>{moduleCount} modules</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p>Video is playing...</p>
          </div>
        )}
      </div>

      {/* Video Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between text-white text-sm">
          <span>00:00 / 15:30</span>
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-300 transition-colors">⏮</button>
            <button className="hover:text-gray-300 transition-colors">⏯</button>
            <button className="hover:text-gray-300 transition-colors">⏭</button>
          </div>
        </div>
      </div>
    </div>
  );
};
