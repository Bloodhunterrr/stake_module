import React from "react";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subMonths,
  subYears,
  format,
  endOfYear,
} from "date-fns";
import { Trans } from "@lingui/react/macro";

type DateFilterProps = {
  selected: string;
  onSelect: (startDate: Date, endDate: Date, label: string) => void;
};

const DateFilter: React.FC<DateFilterProps> = ({ selected, onSelect }) => {
  const today = new Date();
  const filters = [
    {
      label: `Today`,
      start: today,
      end: today,
    },
    {
      label: `Yesterday`,
      start: addDays(today, -1),
      end: addDays(today, -1),
    },
    {
      label: `${format(today, "MMMM")}`,
      start: startOfMonth(today),
      end: today,
    },
    {
      label: `${format(subMonths(today, 1), "MMMM")}`,
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1)),
    },
    {
      label: `${format(today, "yyyy")}`,
      start: startOfYear(today),
      end: today,
    },
    {
      label: `${format(subYears(today, 1), "yyyy")}`,
      start: startOfYear(subYears(today, 1)),
      end: endOfYear(subYears(today, 1)),
    },
  ];

  return (
    <div className="flex w-full overflow-x-auto border-b">
      {filters.map((f) => (
        <div
          key={f.label}
          className={`flex-1 text-center py-2 cursor-pointer ${
            selected === f.label
              ? "border-b-card border-b text-black"
              : "text-gray-700"
          }`}
          onClick={() => onSelect(f.start, f.end, f.label)}
        >
          <Trans>{f.label}</Trans>
        </div>
      ))}
    </div>
  );
};

export default DateFilter;
