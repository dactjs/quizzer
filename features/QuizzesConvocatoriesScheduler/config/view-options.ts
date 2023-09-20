import { SchedulerProps } from "@aldabil/react-scheduler/types";

export type ViewOptions = Pick<SchedulerProps, "day" | "week" | "month">;

export const VIEW_OPTIONS: ViewOptions = {
  day: {
    startHour: 0,
    endHour: 23,
    step: 60,
  },
  week: {
    weekDays: [0, 1, 2, 3, 4, 5, 6],
    weekStartOn: 1,
    startHour: 0,
    endHour: 23,
    step: 60,
  },
  month: {
    weekDays: [0, 1, 2, 3, 4, 5, 6],
    weekStartOn: 1,
    startHour: 0,
    endHour: 23,
  },
};

export default VIEW_OPTIONS;
