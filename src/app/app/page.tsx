"use client";

import { Space } from "@/components/space";
import { Timeline, TimeRange } from "@/components/timeline";
import { useState } from "react";

export default function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    startTime: new Date("2025-02-22T10:00:00"), // 10am
    endTime: new Date("2025-02-22T11:00:00"), // 11am
  });
  const [selectedTime, setSelectedTime] = useState<Date>(timeRange.startTime);
  const [selectedWorkout, setSelectedWorkout] = useState<
    "Push" | "Pull" | "Legs"
  >("Push");

  return (
    <div className="flex">
      <div className="w-1/4 py-12 px-4 flex flex-col gap-8">
        <div>
          <p className="text-2xl font-bold">Workout Details</p>
          <p className="text-gray-400">Your chosen workout on Friday</p>
        </div>
        <div className="flex flex-col gap-2">
          <p
            className={`text-lg ${
              selectedWorkout === "Push"
                ? "font-bold text-white"
                : "text-gray-400"
            }`}
          >
            Push
          </p>
          <p
            className={`text-lg ${
              selectedWorkout === "Pull"
                ? "font-bold text-white"
                : "text-gray-400"
            }`}
          >
            Pull
          </p>
          <p
            className={`text-lg ${
              selectedWorkout === "Pull"
                ? "font-bold text-white"
                : "text-gray-400"
            }`}
          >
            Legs
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold">Time</p>
          <p>16:00 -> 17:00</p>
        </div>
      </div>
      <div className="relative w-3/4 h-full">
        <p>{selectedTime.toLocaleTimeString()}</p>
        <div className="w-full h-[60vh]">
          <Space selectedTime={selectedTime} />
        </div>
        <Timeline
          timeRange={timeRange}
          onSelectedTimeChange={setSelectedTime}
        />
      </div>
    </div>
  );
}
