"use client";

import { memo } from "react";

type TimelinePreviewProps = {
  time: Date;
};

export const TimelinePreview = memo(function TimelinePreview({
  time,
}: TimelinePreviewProps) {
  return (
    <div className="w-full h-full bg-muted/20 rounded flex items-center justify-center select-none">
      <span className="text-xs text-muted-foreground">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
});
