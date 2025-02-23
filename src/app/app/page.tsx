"use client";

import { Visualisation } from "@/components/app-pages/visualisation";
import { WorkoutSelect } from "@/components/app-pages/workout-select";
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
type Workout = {};

export default function App() {
  const [selectedWorkout, setSelectedWorkout] = useState(true);
  return !selectedWorkout ? <WorkoutSelect /> : <Visualisation />;
}
