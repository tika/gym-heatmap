import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type MachineUsage = {
  machine: string;
  arrival_time: number;
  free_time: number;
  wait_time: number;
  usage_start: number;
  usage_finish: number;
};

type MachineTimelineProps = {
  workoutPlan: MachineUsage[];
  className?: string;
};

const formatTime = (seconds: number) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const MachineTimeline = ({
  workoutPlan,
  className,
}: MachineTimelineProps) => {
  return (
    <div className={cn("w-full relative", className)}>
      {/* Continuous vertical line that spans all items */}
      <div className="absolute left-2 top-2 bottom-2 w-[2px] bg-white transform -translate-x-1/2" />

      {workoutPlan.map((usage, index) => (
        <div
          key={`${usage.machine}-${index}`}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-4 w-4 rounded-full bg-white relative z-10" />
          <div className="flex flex-col">
            <span className="text-lg font-medium text-white">
              {usage.machine}
            </span>
            <div className="text-sm text-gray-400 flex gap-1 items-center">
              {formatTime(usage.usage_start)}
              <ArrowRight className="w-4 h-4" />
              {formatTime(usage.usage_finish)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
