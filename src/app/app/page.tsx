"use client";

import { Visualisation } from "@/components/app-pages/visualisation";
import {
  WorkoutData,
  WorkoutSelect,
} from "@/components/app-pages/workout-select";
import { useState } from "react";

/**
 * Push Machines:
- Machine Incline Bench 1
- Incline Bench 1
- Incline Bench 2

Pull Machines:
- Cable Pull Down 1
- Cable Pull Down 2
- Cable Pull Down 3
- Cable Pull Down 4
- Back Row Machine 1
- Back Row Machine 2
- Back Row Machine 3
- Bicep Curls Machine 1

Leg:
- Leg Press 1
- Squat Rack 1
- Leg Extension 1
- Leg Curl 1
- Calf Raise 1
 */

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

export default function App() {
  const [isWorkoutSelected, setIsWorkoutSelected] = useState(true);
  const [workoutSchedule, setWorkoutSchedule] = useState<WorkoutData | null>(
    null
  ); // if null then probably loading..

  return isWorkoutSelected ? (
    <WorkoutSelect
      onNext={() => setIsWorkoutSelected(false)}
      makeWorkoutPlan={(workoutType, duration) => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API as string, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            muscle_group: workoutType,
            workout_duration: duration,
          }),
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to create workout plan");
          }

          const workoutData: APIResponse = await res.json();

          // Set workout data after a while...
          setWorkoutSchedule({
            schedule: workoutData.schedule,
            totalDuration: workoutData.total_duration,
          });
        });
      }}
    />
  ) : (
    <Visualisation
      onBack={() => setIsWorkoutSelected(true)}
      workoutData={workoutSchedule}
    />
  );
}
