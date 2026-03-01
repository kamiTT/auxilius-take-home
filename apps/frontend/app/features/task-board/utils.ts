import { COLUMN_ORDER, EMPTY_GROUPED_TASKS } from "./constants";
import type { Task, TaskStatus } from "./types";

export const groupTasksByStatus = (tasks: Task[]): Record<TaskStatus, Task[]> => {
  return COLUMN_ORDER.reduce<Record<TaskStatus, Task[]>>((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, { ...EMPTY_GROUPED_TASKS });
};

