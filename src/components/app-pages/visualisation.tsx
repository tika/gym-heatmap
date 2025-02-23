"use client";

import { WorkoutData } from "@/components/app-pages/workout-select";
import { SidePane } from "@/components/side-pane";
import { Point, Space } from "@/components/space";
import { Timeline, TimeRange } from "@/components/timeline";
import { useEffect, useMemo, useState } from "react";

const TIME_WINDOW = 30; // seconds before and after current time

type Schedule = {
  machine: string;
  arrival_time: number;
  free_time: number;
  wait_time: number;
  usage_start: number;
  usage_finish: number;
};

type VisualisationProps = {
  onBack: () => void;
  workoutData: WorkoutData | null;
};

export function Visualisation({ onBack, workoutData }: VisualisationProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeRange, setTimeRange] = useState<TimeRange>({
    startTime: new Date("2025-02-23T16:00:00"), // 10am
    endTime: new Date("2025-02-23T18:00:00"), // 11am
  });
  const [selectedTime, setSelectedTime] = useState<Date>(timeRange.startTime);

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
      const rows = await fetch("/gym_data.csv").then((res) => res.text());
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
      <div className="w-full md:w-1/4 py-4 px-4 flex flex-col gap-8 bg-black rounded-md">
        <SidePane
          timeRange={timeRange}
          onBack={onBack}
          workoutData={workoutData}
        />
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
