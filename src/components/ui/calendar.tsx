"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      style={
        {
          "--rdp-accent-color": "#4A4A7A",
          "--rdp-accent-background-color": "#E8E8F0",
          "--rdp-day-width": "32px",
          "--rdp-day-height": "32px",
          "--rdp-day_button-width": "32px",
          "--rdp-day_button-height": "32px",
          fontSize: "0.825rem",
        } as React.CSSProperties
      }
      className={cn("p-2", className)}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
