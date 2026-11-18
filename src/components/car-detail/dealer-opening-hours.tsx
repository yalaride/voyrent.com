"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

export type OpeningHourRow = {
  dayIndex: number;
  label: string;
  hours: string;
};

const emptySubscribe = () => () => {};

function useTodayIndex() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => new Date().getDay(),
    () => null,
  );
}

export function DealerOpeningHours({
  openStatusLabel,
  closesAtLabel,
  schedule,
}: {
  openStatusLabel: string;
  closesAtLabel: string;
  schedule: OpeningHourRow[];
}) {
  const todayIndex = useTodayIndex();

  return (
    <details open className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[15px] leading-[1.5] [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-success">{openStatusLabel}</span>
          <span className="text-text-secondary">•</span>
          <span className="text-text-secondary">{closesAtLabel}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-text-primary transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <ul className="mt-3 flex flex-col gap-2 text-[14px] leading-[1.5] sm:text-[15px]">
        {schedule.map((row) => {
          const isToday = todayIndex !== null && row.dayIndex === todayIndex;
          return (
            <li
              key={row.dayIndex}
              className={`flex items-center justify-between gap-4 ${
                isToday
                  ? "font-semibold text-text-primary"
                  : "font-normal text-text-secondary"
              }`}
            >
              <span>{row.label}</span>
              <span>{row.hours}</span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
