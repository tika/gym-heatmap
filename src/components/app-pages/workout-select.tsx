"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

  function handleCreateWorkout() {
    // Handle submission
    // TODO: API call to create workout

    onNext();
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <a
          className={buttonVariants({ variant: "outline", size: "icon" })}
          href="/"
        >
          <ArrowLeft />
        </a>
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

          <Input
            value={customWorkout}
            onChange={(e) => setCustomWorkout(e.target.value)}
            className="text-lg"
            placeholder="Enter your custom workout..."
          />

          <div className="space-y-4">
            <h2 className="text-xl text-foreground">
              Or you can input something else... something custom
            </h2>
            <div className="flex gap-4">
              <div className="w-full flex items-center justify-start">
                <div className="flex gap-6">
                  {days.map((day, index) => (
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
                  ))}
                </div>
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
