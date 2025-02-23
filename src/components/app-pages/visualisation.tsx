"use client";

import { Point, Space } from "@/components/space";
import { Timeline, TimeRange } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const TIME_WINDOW = 30; // seconds before and after current time

type VisualisationProps = {
  onBack: () => void;
};

export function Visualisation(props: VisualisationProps) {
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

          return {
            x: parseFloat(data[0]),
            y: parseFloat(data[1]),
            z: parseFloat(data[2]),
            time: actualTime,
            object: data[4] as "person" | "machine",
            paired: parseFloat(data[5]),
            role: data[6] as "person" | "machine",
            state: data[7] as "traveling" | "waiting" | "using",
          } satisfies Point;
        });
      setAllGymData(data as Point[]);
    };
    loadGymData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-24 gap-4">
      <div className="w-full md:w-1/4 py-4 md:py-12 px-4 flex flex-col gap-8 bg-muted">
        <div>
          <Button variant="ghost" size="icon" onClick={props.onBack}>
            <ArrowLeft />
          </Button>
          <p className="text-2xl font-bold mt-4">Workout Details</p>
          <p className="text-gray-400">
            An optimised workout has been generated for you
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p
            className={`text-lg ${
              selectedWorkout === "Push"
                ? "font-bold text-white"
                : "text-gray-400"
            }`}
          >
            Push day
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold">Time</p>
          <p>
            {timeRange.startTime.getHours().toString().padStart(2, "0")}:00 →{" "}
            {timeRange.endTime.getHours().toString().padStart(2, "0")}:00
          </p>
        </div>
      </div>
      <div className="relative w-full md:w-3/4 h-full flex flex-col items-center">
        <div className="w-full h-[40vh] md:h-[60vh] border rounded-md">
          <Space selectedTime={selectedTime} gymData={visibleGymData} />
        </div>
        <Timeline
          timeRange={timeRange}
          onSelectedTimeChange={setSelectedTime}
        />
        <p className="font-semibold mt-2">
          Typical Activity @ {selectedTime.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
