"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type TimeRange = {
  startTime: Date;
  endTime: Date;
};

type TimelineProps = {
  timeRange: TimeRange;
  onSelectedTimeChange: (time: Date) => void;
};

export function Timeline({ timeRange, onSelectedTimeChange }: TimelineProps) {
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

  // Take the slide % and show it in time
  const selectedTime = useMemo(
    () =>
      new Date(
        timeRange.startTime.getTime() +
          (timeRange.endTime.getTime() - timeRange.startTime.getTime()) *
            (slidePercentage / 100)
      ),
    [slidePercentage, timeRange]
  );

  useEffect(() => {
    onSelectedTimeChange(selectedTime);
  }, [selectedTime]);

  return (
    <div className="w-full border-2 border-gray-400 rounded-md p-1">
      <div
        key={1}
        className="flex w-full relative"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
          setSlidePercentage(Math.round(percentage));
        }}
      >
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10 transition-all duration-[100ms] ease-out"
          style={{ left: `${slidePercentage}%` }}
        />
        {slices.map((it, index) => (
          <div className="relative h-12 w-full" key={index}>
            <Image
              src={it}
              alt="gym"
              layout="fill"
              objectFit="cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
