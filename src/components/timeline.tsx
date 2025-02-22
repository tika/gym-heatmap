"use client";

import Image from "next/image";
import { useState } from "react";

type TimeRange = {
  startTime: Date;
  endTime: Date;
};

export function Timeline() {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    startTime: new Date("2025-02-22T10:00:00"), // 10am
    endTime: new Date("2025-02-22T11:00:00"), // 11am
  });
  const [slices, setSlices] = useState<string[]>([
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
    "https://picsum.photos/id/237/1920/1080",
  ]);
  const [slidePercentage, setSlidePercentage] = useState(0);

  // TODO: take the 3d mapping and take images so that there are 10 images (thus there will be 10% of the timeline that is that image)

  return (
    <div className="w-full border-2 border-gray-400 rounded-md p-1">
      <p>{slidePercentage}%</p>
      <div
        key={1}
        className="flex w-full"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
          setSlidePercentage(Math.round(percentage));
        }}
        onMouseLeave={() => setSlidePercentage(0)}
      >
        {slices.map((it, index) => (
          <div className="relative h-12 w-full">
            <Image
              key={index}
              src={it}
              alt="gym"
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
