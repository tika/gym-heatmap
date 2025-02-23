"use client";

import { TimelinePreview } from "@/components/timeline-preview";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const timelineRef = useRef<HTMLDivElement>(null);
  const [slidePercentage, setSlidePercentage] = useState(0);
  const rafRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const timeSlices = useMemo(() => generateTimeSlices(timeRange), [timeRange]);

  const selectedTime = useMemo(
    () =>
      new Date(
        timeRange.startTime.getTime() +
          (timeRange.endTime.getTime() - timeRange.startTime.getTime()) *
            (slidePercentage / 100)
      ),
    [slidePercentage, timeRange]
  );

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);

    rafRef.current = requestAnimationFrame(() => {
      setSlidePercentage(percentage);
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDraggingRef.current = true;
      timelineRef.current?.setPointerCapture(e.pointerId);
      updateSliderPosition(e.clientX);
    },
    [updateSliderPosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      updateSliderPosition(e.clientX);
    },
    [updateSliderPosition]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    timelineRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    onSelectedTimeChange(selectedTime);
  }, [selectedTime, onSelectedTimeChange]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full border-2 border-gray-400 rounded-md p-1">
      <div
        className="flex w-full relative cursor-grab active:cursor-grabbing"
        ref={timelineRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
          style={{
            left: `${slidePercentage}%`,
            transform: "translateX(-50%)",
            willChange: "left",
          }}
        />
        {timeSlices.map((time) => (
          <div
            className="relative h-12"
            style={{ width: "10%" }}
            key={time.getTime()}
          >
            <TimelinePreview time={time} />
          </div>
        ))}
      </div>
    </div>
  );
}
