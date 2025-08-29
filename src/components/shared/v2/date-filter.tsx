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

  const filtersTranslations: Record<string, any> = {
    Today: <Trans>Today</Trans>,
    Yesterday: <Trans>Yesterday</Trans>,
    January: <Trans>January</Trans>,
    February: <Trans>February</Trans>,
    March: <Trans>March</Trans>,
    April: <Trans>April</Trans>,
    May: <Trans>May</Trans>,
    June: <Trans>June</Trans>,
    July: <Trans>July</Trans>,
    August: <Trans>August</Trans>,
    September: <Trans>September</Trans>,
    October: <Trans>October</Trans>,
    November: <Trans>November</Trans>,
    December: <Trans>December</Trans>,
  };

  const filters = [
    {
      key: "today",
      label: filtersTranslations["Today"],
      start: today,
      end: today,
    },
    {
      key: "yesterday",
      label: filtersTranslations["Yesterday"],
      start: addDays(today, -1),
      end: addDays(today, -1),
    },
    {
      key: format(today, "MMMM"),
      label:
        filtersTranslations[format(today, "MMMM")] ?? format(today, "MMMM"),
      start: startOfMonth(today),
      end: today,
    },
    {
      key: format(subMonths(today, 1), "MMMM"),
      label:
        filtersTranslations[format(subMonths(today, 1), "MMMM")] ??
        format(subMonths(today, 1), "MMMM"),
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1)),
    },
    {
      key: format(today, "yyyy"),
      label: `${format(today, "yyyy")}`,
      start: startOfYear(today),
      end: today,
    },
    {
      key: format(subYears(today, 1), "yyyy"),
      label: `${format(subYears(today, 1), "yyyy")}`,
      start: startOfYear(subYears(today, 1)),
      end: endOfYear(subYears(today, 1)),
    },
  ];

  console.log(selected);

  return (
    <div className="flex w-full overflow-x-auto border-b">
      {filters.map((f) => (
        <div
          key={f.key}
          className={`flex-1 text-center py-2 cursor-pointer ${
            selected === f.key
              ? "border-b-card border-b text-black"
              : "text-gray-700"
          }`}
          onClick={() => onSelect(f.start, f.end, f.key)}
        >
          {f.label}
        </div>
      ))}
    </div>
  );
};

export default DateFilter;
