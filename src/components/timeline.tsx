"use client";

import { Space } from "@/components/space";
import { useEffect, useMemo, useState } from "react";

export type TimeRange = {
  startTime: Date;
  endTime: Date;
};

type TimelineProps = {
  timeRange: TimeRange;
  onSelectedTimeChange: (time: Date) => void;
};

const generateTimeSlices = (timeRange: TimeRange): Date[] => {
  const { startTime, endTime } = timeRange;
  const timeSpan = endTime.getTime() - startTime.getTime();
  const interval = timeSpan / 9; // 9 intervals for 10 points

  return Array.from(
    { length: 10 },
    (_, i) => new Date(startTime.getTime() + interval * i)
  );
};

export function Timeline({ timeRange, onSelectedTimeChange }: TimelineProps) {
  const timeSlices = useMemo(() => generateTimeSlices(timeRange), [timeRange]);
  const [slidePercentage, setSlidePercentage] = useState(0);

  // Each slice will be 10% of the timeline
  const sliceWidth = "10%";

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
  }, [selectedTime, onSelectedTimeChange]);

  return (
    <div className="w-full border-2 border-gray-400 rounded-md p-1">
      <div
        className="flex w-full relative"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
          setSlidePercentage(Math.round(percentage * 100) / 100);
        }}
      >
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10 transition-all duration-[100ms] ease-out"
          style={{ left: `${slidePercentage}%` }}
        />
        {timeSlices.map((time, index) => (
          <div
            className="relative h-12"
            style={{ width: sliceWidth }}
            key={time.getTime()}
          >
            <Space isPreview={true} selectedTime={time} />
          </div>
        ))}
      </div>
    </div>
  );
}
