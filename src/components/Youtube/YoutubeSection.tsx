import Image from "next/image";
import React from "react";

type Props = {};

export default function YoutubeSection({}: Props) {
  return (
    <>
      {/* Latest YouTube Videos */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-4">Latest Youtube Videos</h2>
              <div className="flex items-center gap-4 mb-10 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  255K subscribers
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15V6" />
                    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M12 12H3" />
                    <path d="M16 6H3" />
                    <path d="M12 18H3" />
                  </svg>
                  427 videos
                </div>
              </div>

              <div className="space-y-8">
                {/* Video 1 */}
                <div className="grid md:grid-cols-[200px,1fr] gap-4">
                  <div className="relative h-32">{/* <Image src="/video-placeholder-1.jpg" alt="System Design for Beginners" fill className="object-cover rounded-lg" /> */}</div>
                  <div>
                    <h3 className="font-bold mb-1">System Design for Beginners</h3>
                    <p className="text-gray-500 text-sm mb-2">17 May 2025</p>
                    <p className="text-gray-400 text-sm">
                      Hey everyone, in this video, we are going to discuss System Design for Beginners and all components of a scalable system...
                    </p>
                  </div>
                </div>

                {/* Video 2 */}
                <div className="grid md:grid-cols-[200px,1fr] gap-4">
                  <div className="relative h-32">
                    {/* <Image src="/video-placeholder-2.jpg" alt="I Built my AI Girlfriend - Finally!" fill className="object-cover rounded-lg" /> */}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">I Built my AI Girlfriend - Finally!</h3>
                    <p className="text-gray-500 text-sm mb-2">08 May 2025</p>
                    <p className="text-gray-400 text-sm">
                      Hi Everyone, in this video, we are going to see how you can build your own AI Girlfriend using OpenAI and Google Gemini AI LLM...
                    </p>
                  </div>
                </div>

                {/* Video 3 */}
                <div className="grid md:grid-cols-[200px,1fr] gap-4">
                  <div className="relative h-32">
                    {/* <Image src="/video-placeholder-3.jpg" alt="Master Role-Based Access Control Patterns" fill className="object-cover rounded-lg" /> */}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Master Role-Based Access Control Patterns</h3>
                    <p className="text-gray-500 text-sm mb-2">03 May 2025</p>
                    <p className="text-gray-400 text-sm">
                      Hey everyone, In this video, we are going to see various role-based access control authorization patterns such as RBAC, PBAC, ...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Gears</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-1">14 Inch M3 Max MacBook Pro</h4>
                  <p className="text-gray-400 text-sm">My main machine for development that I've been using for over 6 months now. Such a beast of a machine. I love it.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Logitech MX Mechanical</h4>
                  <p className="text-gray-400 text-sm">
                    My main keyboard for development. I love the clicky keys and the compact size. I use it with a Logitech MX Master 3 mouse.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Logitech MX Master 3S</h4>
                  <p className="text-gray-400 text-sm">My main mouse for development. I love the scroll wheel and the thumb buttons. I use it with a Logitech MX Mechanical.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">BenQ 4K Monitor</h4>
                  <p className="text-gray-400 text-sm">Main monitor I use for coding. I love the display and 4K is really good to have.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
