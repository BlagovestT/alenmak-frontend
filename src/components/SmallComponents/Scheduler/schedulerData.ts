import { DayProps } from "@aldabil/react-scheduler/views/Day";
import { MonthProps } from "@aldabil/react-scheduler/views/Month";
import { WeekProps } from "@aldabil/react-scheduler/views/Week";

export const MONTH: MonthProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 1,
  startHour: 0,
  endHour: 24,
};

export const WEEK: WeekProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 1,
  startHour: 0,
  endHour: 24,
  step: 60,
};

export const DAY: DayProps = {
  startHour: 0,
  endHour: 24,
  step: 60,
};
