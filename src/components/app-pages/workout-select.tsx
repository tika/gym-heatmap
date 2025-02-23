"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const days = ["M", "T", "W", "T", "F", "S", "S"];

type WorkoutSelectProps = {
  onNext: () => void;
  makeWorkoutPlan: (workoutType: string | undefined, duration: number) => void;
};

type Schedule = {
  machine: string;
  arrival_time: number;
  free_time: number;
  wait_time: number;
  usage_start: number;
  usage_finish: number;
};

type APIResponse = {
  best_ordering: string[];
  schedule: Schedule[];
  total_wait: number;
  total_duration: number;
};

export type WorkoutData = {
  totalDuration: number;
  schedule: Schedule[];
};

export function WorkoutSelect({ onNext, makeWorkoutPlan }: WorkoutSelectProps) {
  const [customWorkout, setCustomWorkout] = useState("");
  const [workoutType, setWorkoutType] = useState<
    "Push" | "Pull" | "Legs" | null
  >("Push");
  const [selectedDay, setSelectedDay] = useState<keyof typeof days | null>(
    null
  );
  const [duration, setDuration] = useState<"30" | "45" | "60">("30");

  function toggleWorkoutType(type: "Push" | "Pull" | "Legs") {
    if (workoutType === type) {
      setWorkoutType(null);
    } else {
      setWorkoutType(type);
    }
  }

  function toggleSelectedDay(day: keyof typeof days) {
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  }

  async function handleCreateWorkout() {
    try {
      //   First call to summarise endpoint
      console.log(workoutType);
      const summaryResponse = await fetch("/api/summarise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutType: workoutType,
          details: customWorkout.length === 0 ? undefined : customWorkout,
        }),
      });

      if (!summaryResponse.ok) {
        throw new Error("Failed to summarize workout");
      }

      // Second call to create workout plan
      makeWorkoutPlan(workoutType?.toLowerCase(), parseInt(duration));

      onNext();
    } catch (error) {
      console.error("Error creating workout:", error);
      // Here you might want to show an error message to the user
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          className={buttonVariants({ variant: "outline", size: "icon" })}
          href="/"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-4xl font-bold text-foreground">Create workout</h1>

        <form
          action={handleCreateWorkout}
          className="flex flex-col gap-8"
          onSubmit={handleCreateWorkout}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={cn(
                "h-24 text-xl",
                workoutType === "Push" && "bg-muted border-primary"
              )}
              onClick={() => toggleWorkoutType("Push")}
              type="button"
            >
              Push
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-24 text-xl",
                workoutType === "Pull" && "bg-muted border-primary"
              )}
              onClick={() => toggleWorkoutType("Pull")}
              type="button"
            >
              Pull
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-24 text-xl",
                workoutType === "Legs" && "bg-muted border-primary"
              )}
              onClick={() => toggleWorkoutType("Legs")}
              type="button"
            >
              Legs
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-foreground">Custom input</h2>
            <Input
              value={customWorkout}
              onChange={(e) => setCustomWorkout(e.target.value)}
              className="text-lg"
              placeholder="Custom workout..."
            />
            <p className="text-sm text-muted-foreground">
              Add custom details if you want a nuanced workout
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-foreground">
              How long do you plan to work out?
            </h2>
            <Select
              value={duration}
              onValueChange={(value: "30" | "45" | "60") => setDuration(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 mins</SelectItem>
                <SelectItem value="45">45 mins</SelectItem>
                <SelectItem value="60">60 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-foreground">
              Which days do you prefer to work out?
            </h2>
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-6">
                <TooltipProvider>
                  {days.map((day, index) =>
                    index === 6 ? (
                      <Button
                        key={`day-${index}-${day}`}
                        className="rounded-full"
                        size="icon"
                        variant={index === selectedDay ? "default" : "outline"}
                        onClick={() => toggleSelectedDay(index)}
                        type="button"
                      >
                        <p>{day}</p>
                      </Button>
                    ) : (
                      <Tooltip key={`day-${index}-${day}`}>
                        <TooltipTrigger asChild>
                          <Button
                            className={cn("rounded-full opacity-50")}
                            size="icon"
                            variant="outline"
                            disabled
                            type="button"
                          >
                            <p>{day}</p>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sorry we don't have data for that day yet!</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  )}
                </TooltipProvider>
              </div>
              <Button
                className="px-8"
                disabled={!customWorkout && !workoutType}
                type="submit"
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
