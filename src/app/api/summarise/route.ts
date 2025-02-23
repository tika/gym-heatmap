// Route to summarise the workout, puts in your description & push/pull/legs and outputs a short description

// E.g.
// Input:
// - Workkout Type?: Push
// - Details: I want to get really big shoulders
// Output:
// - Push day for big shoulders

import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";

// Zod schema for input validation

const SummariseSchema = z
  .object({
    workoutType: z.enum(["Push", "Pull", "Legs"]).optional(),
    details: z.string().min(1).max(500).optional(),
  })
  .refine((data) => data.workoutType || data.details, {
    message: "At least one of workoutType or details must be provided",
  });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = SummariseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { workoutType, details } = result.data;

    if (workoutType && !details) {
      return NextResponse.json({ summary: workoutType }, { status: 200 });
    }

    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a fitness bot at Tufts University. You must generate around 8 sensible words to summarise the workout that the user describes and NOTHING ELSE should be generated.\n\n" +
            "EXAMPLE User Input:\n" +
            "Workout Type?: Push\n" +
            "Details: I want to get really big shoulders\n" +
            "EXAMPLE Output:\n" +
            "Push day for big shoulders\n" +
            "DO NOT HALLUCINATE ANYTHING ELSE. ONLY OUTPUT BASED ON THE USER'S INPUT. KEEP IT AS SHORT AS POSSIBLE.",
        },
        {
          role: "user",
          content: `${workoutType ? `Workout Type: ${workoutType}\n` : ""}${
            details ? `Details: ${details}\n` : ""
          } Provide a concise one-line summary.`,
        },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content?.trim();

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
