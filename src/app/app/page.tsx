"use client";

import { Point, Space } from "@/components/space";
import { Timeline, TimeRange } from "@/components/timeline";
import { useEffect, useMemo, useState } from "react";

const TIME_WINDOW = 30; // seconds before and after current time

export default function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    startTime: new Date("2025-02-22T10:00:00"), // 10am
    endTime: new Date("2025-02-22T11:00:00"), // 11am
  });
  const [selectedTime, setSelectedTime] = useState<Date>(timeRange.startTime);
  const [selectedWorkout, setSelectedWorkout] = useState<
    "Push" | "Pull" | "Legs"
  >("Push");

  // Load fake gym data from fake_gym_data.csv
  const [allGymData, setAllGymData] = useState<Point[]>([]);

  // Filter data around the selected time
  const visibleGymData = useMemo(() => {
    if (!allGymData.length) return [];

    const selectedTimeMs = selectedTime.getTime();
    return allGymData.filter((point) => {
      const timeDiff = Math.abs(point.time.getTime() - selectedTimeMs) / 1000;
      return timeDiff <= TIME_WINDOW;
    });
  }, [allGymData, selectedTime]);

  useEffect(() => {
    const loadGymData = async () => {
      const rows = await fetch("/fake_gym_data.csv").then((res) => res.text());
      const data = rows
        .split("\n")
        .slice(1)
        .map((row) => {
          const data = row.split(",");
          // Convert the numeric time to a Date object by adding seconds to the base time
          const baseTime = new Date("2025-02-22T10:00:00");
          const timeInSeconds = parseInt(data[3]);
          const actualTime = new Date(
            baseTime.getTime() + timeInSeconds * 1000
          );

          console.log(actualTime);

          return {
            x: parseFloat(data[0]),
            y: parseFloat(data[1]),
            z: parseFloat(data[2]),
            time: actualTime,
            object: data[4] as "person" | "machine",
            paired: data[5] === "true",
            role: data[6] as "person" | "machine",
          } satisfies Point;
        });
      setAllGymData(data as Point[]);
    };
    loadGymData();
  }, []);

  console.log(visibleGymData);

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
          <p>16:00 - 17:00</p>
        </div>
      </div>
      <div className="relative w-3/4 h-full">
        <p>{selectedTime.toLocaleTimeString()}</p>
        <div className="w-full h-[60vh]">
          <Space selectedTime={selectedTime} gymData={visibleGymData} />
        </div>
        <Timeline
          timeRange={timeRange}
          onSelectedTimeChange={setSelectedTime}
        />
      </div>
    </div>
  );
}
