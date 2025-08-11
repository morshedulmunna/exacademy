import React from "react";
import Modal from "@/components/ui/modal";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  // Default video URL if none provided
  const defaultVideoUrl = videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="relative w-full aspect-video">
        <iframe src={defaultVideoUrl} title={title || "Course Preview"} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    </Modal>
  );
}
