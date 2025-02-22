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

  return (
    <div>
      <p>{selectedTime.toLocaleTimeString()}</p>
      <div className="w-full h-[60vh]">
        <Space selectedTime={selectedTime} />
      </div>
      <Timeline timeRange={timeRange} onSelectedTimeChange={setSelectedTime} />
    </div>
  );
}
