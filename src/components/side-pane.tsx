import { WorkoutData } from "@/components/app-pages/workout-select";
import { MachineTimeline } from "@/components/machine-timeline";
import { TimeRange } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

type SidePaneProps = {
  timeRange: TimeRange;
  onBack: () => void;
  workoutData: WorkoutData | null;
};

export function SidePane({ timeRange, onBack, workoutData }: SidePaneProps) {
  if (!workoutData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">
          Loading workout data...
        </p>
      </div>
    );
  }

  const totalDuration = workoutData?.totalDuration ?? 0;
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

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
        <div className="flex flex-col gap-2">
          <p className="text-lg text-white">Total Duration</p>
          <p className="text-sm text-gray-400">
            {hours > 0 ? `${hours}h ` : ""}
            {minutes}min
          </p>
        </div>

        {workoutData?.schedule && (
          <MachineTimeline
            workoutPlan={workoutData.schedule}
            className="mt-4"
          />
        )}

        <div>
          <p className="text-2xl font-bold">Time Window</p>
          <p className="text-sm text-gray-400">
            {timeRange.startTime.getHours().toString().padStart(2, "0")}:00 →{" "}
            {timeRange.endTime.getHours().toString().padStart(2, "0")}:00
          </p>
        </div>
      </div>
    </div>
  );
}
