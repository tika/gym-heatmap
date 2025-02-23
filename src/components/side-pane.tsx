import { MachineTimeline } from "@/components/machine-timeline";
import { TimeRange } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function SidePane({
  timeRange,
  onBack,
}: {
  timeRange: TimeRange;
  onBack: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft />
          <span>Change Workout</span>
        </Button>
      </div>

      <p className="text-2xl font-bold mt-4">Workout Details</p>

      <div className="flex flex-col gap-4">
        <p className="text-lg text-white">Push day</p>
        <MachineTimeline
          workoutPlan={[
            {
              machine: "Back Row Machine 1",
              arrival_time: 0,
              free_time: 0,
              wait_time: 0,
              usage_start: 0,
              usage_finish: 420,
            },
            {
              machine: "Cable Pull Down 1",
              arrival_time: 480,
              free_time: 568,
              wait_time: 88,
              usage_start: 568,
              usage_finish: 988,
            },
          ]}
        />

        <div>
          <p className="text-2xl font-bold">Time</p>
          <p>
            {timeRange.startTime.getHours().toString().padStart(2, "0")}:00 →{" "}
            {timeRange.endTime.getHours().toString().padStart(2, "0")}:00
          </p>
        </div>
      </div>
    </div>
  );
}
