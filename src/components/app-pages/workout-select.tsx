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
};

export function WorkoutSelect({ onNext }: WorkoutSelectProps) {
  const [customWorkout, setCustomWorkout] = useState("");
  const [workoutType, setWorkoutType] = useState<
    "push" | "pull" | "legs" | null
  >("push");
  const [selectedDay, setSelectedDay] = useState<keyof typeof days | null>(
    null
  );
  const [duration, setDuration] = useState<"30" | "45" | "60">("30");

  function toggleWorkoutType(type: "push" | "pull" | "legs") {
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
      // First call to summarise endpoint
      //   const summaryResponse = await fetch("/api/summarise", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       workoutType: workoutType,
      //       details: customWorkout.length === 0 ? null : customWorkout,
      //     }),
      //   });

      //   if (!summaryResponse.ok) {
      //     throw new Error("Failed to summarize workout");
      //   }

      //   // Second call to create workout plan
      //   const workoutResponse = await fetch(
      //     "https://jumbogym.onrender.com/createWorkout",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         muscle_group: workoutType,
      //         workout_duration: parseInt(duration),
      //       }),
      //     }
      //   );

      //   if (!workoutResponse.ok) {
      //     throw new Error("Failed to create workout plan");
      //   }

      //   const workoutData = await workoutResponse.json();
      //   console.log("Workout plan:", workoutData);

      // Continue with navigation
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
                workoutType === "push" && "bg-muted border-primary"
              )}
              onClick={() => toggleWorkoutType("push")}
              type="button"
            >
              push
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-24 text-xl",
                workoutType === "pull" && "bg-muted border-primary"
              )}
              onClick={() => toggleWorkoutType("pull")}
              type="button"
            >
              pull
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-24 text-xl",
                workoutType === "legs" && "bg-muted border-primary"
              )}
              onClick={() => toggleWorkoutType("legs")}
              type="button"
            >
              legs
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
