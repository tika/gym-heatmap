"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function WorkoutSelect() {
  const [customWorkout, setCustomWorkout] = useState("");
  const [workoutType, setWorkoutType] = useState<
    "push" | "pull" | "legs" | null
  >("push");

  function toggleWorkoutType(type: "push" | "pull" | "legs") {
    if (workoutType === type) {
      setWorkoutType(null);
    } else {
      setWorkoutType(type);
    }
  }

  function handleCreateWorkout() {
    // Handle submission
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Create workout</h1>

        <form action={handleCreateWorkout}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={cn(
                "h-24 text-xl",
                workoutType === "push" && "bg-muted border-primary"
              )}
              onClick={() => toggleWorkoutType("push")}
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
            >
              legs
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-foreground">
              Or you can input something else... something custom
            </h2>
            <div className="flex gap-4">
              <Input
                value={customWorkout}
                onChange={(e) => setCustomWorkout(e.target.value)}
                className="text-lg"
                placeholder="Enter your custom workout..."
              />
              <Button
                className="px-8"
                onClick={() => handleCreateWorkout(customWorkout)}
                disabled={!customWorkout}
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
