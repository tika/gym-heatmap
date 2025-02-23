"use client";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function GoogleGeminiEffectDemo() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div>
      <div
        className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
        ref={ref}
      >
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
      <div>
        <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 text-lg leading-relaxed">
          <h1 className="text-3xl font-bold mb-8">
            Privacy-Conscious Gym Occupancy Optimization
          </h1>

          <p>
            This project addresses the challenge of gym overcrowding while
            mitigating the privacy concerns associated with biometric scanning.
          </p>

          <p>
            By leveraging a RealSense depth camera, the system periodically
            captures spatial data of the gym environment, converting it into
            structured CSV datasets. These datasets are then processed by a
            machine learning pipeline, which dynamically analyzes machine
            occupancy trends to generate optimized workout schedules.
          </p>

          <p>
            Users receive personalized low-wait-time workout plans, guiding them
            on the best machines to use and the ideal time to visit the gym for
            minimal congestion. The system employs computer vision-based object
            recognition to identify gym machines and individuals within the
            environment without requiring intrusive biometric data collection.
          </p>

          <p>
            Instead of tracking individuals directly, it focuses on
            spatiotemporal occupancy patterns, proving that efficient gym
            management can be achieved without compromising personal privacy.
          </p>

          <p>
            Future iterations will incorporate user-selected timeframes, but the
            current implementation is optimized for a rolling two-hour dataset.
            This project is an advanced take on privacy-conscious real-time gym
            space optimization using depth sensing and AI-driven predictive
            modeling.
          </p>
        </div>
      </div>
      <div>
        Created by Tika Capon, Anubhav Sinha, Daniel Siegel, Dean Hu, Marco
        Dorazio
        <Link href="...">Devpost</Link>
        <Link href="https://github.com/tika/gymbo">Frontend</Link>
        <Link href="https://github.com/tika/gymbobackend">Backend</Link>
      </div>
    </div>
  );
}
