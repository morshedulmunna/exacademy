import React from "react";
import VideoList from "./VideoList";
import Gears from "./Gears";

type Props = {};

export default function YoutubeSection({}: Props) {
  const videos = [
    {
      title: "System Design for Beginners",
      date: "17 May 2025",
      description: "Hey everyone, in this video, we are going to discuss System Design for Beginners and all components of a scalable system...",
      url: "https://www.youtube.com/watch?v=example1",
      thumbnail: "https://img.youtube.com/vi/example1/maxresdefault.jpg",
    },
    {
      title: "I Built my AI Girlfriend - Finally!",
      date: "08 May 2025",
      description: "Hi Everyone, in this video, we are going to see how you can build your own AI Girlfriend using OpenAI and Google Gemini AI LLM...",
      url: "https://www.youtube.com/watch?v=example2",
      thumbnail: "https://img.youtube.com/vi/example2/maxresdefault.jpg",
    },
    {
      title: "Master Role-Based Access Control Patterns",
      date: "03 May 2025",
      description: "Hey everyone, In this video, we are going to see various role-based access control authorization patterns such as RBAC, PBAC, ...",
      url: "https://www.youtube.com/watch?v=example3",
      thumbnail: "https://img.youtube.com/vi/example3/maxresdefault.jpg",
    },
  ];

  const gears = [
    {
      title: "14 Inch M3 Max MacBook Pro",
      description: "My main machine for development that I've been using for over 6 months now. Such a beast of a machine. I love it.",
      url: "https://www.apple.com/macbook-pro-14-and-16/",
    },
    {
      title: "Logitech MX Mechanical",
      description: "My main keyboard for development. I love the clicky keys and the compact size. I use it with a Logitech MX Master 3 mouse.",
      url: "https://www.logitech.com/en-us/products/keyboards/mx-mechanical.html",
    },
    {
      title: "Logitech MX Master 3S",
      description: "My main mouse for development. I love the scroll wheel and the thumb buttons. I use it with a Logitech MX Mechanical.",
      url: "https://www.logitech.com/en-us/products/mice/mx-master-3s.html",
    },
    {
      title: "BenQ 4K Monitor",
      description: "Main monitor I use for coding. I love the display and 4K is really good to have.",
      url: "https://www.benq.com/en-us/monitor/home.html",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          <VideoList videos={videos} />
          <Gears gears={gears} />
        </div>
      </div>
    </section>
  );
}
