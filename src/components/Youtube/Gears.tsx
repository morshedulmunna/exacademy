import React from "react";

type Gear = {
  title: string;
  description: string;
  url: string;
};

type GearsProps = {
  gears: Gear[];
};

export default function Gears({ gears }: GearsProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Gears</h3>
      <div className="space-y-6">
        {gears.map((gear, index) => (
          <a key={index} href={gear.url} target="_blank" rel="noopener noreferrer" className="block group transition-colors rounded-lg p-2 -m-2">
            <div>
              <h4 className="font-medium mb-1 group-hover:text-cyan-400 transition-colors duration-300">{gear.title}</h4>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{gear.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
