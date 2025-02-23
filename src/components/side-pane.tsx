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
      <div className="h-full">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft />
            <span>Change Workout</span>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Loading workout data (~30 seconds)...
          </p>
        </div>
      </div>
    );
  }

  const totalDuration = workoutData?.totalDuration ?? 0;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

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
        {workoutData.summary && (
          <p className="text-lg text-white">{workoutData.summary}</p>
        )}

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
      </div>
    </div>
  );
}
