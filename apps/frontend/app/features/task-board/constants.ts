import type { Task, TaskStatus } from "./types";

export const USERNAME_STORAGE_KEY = "auxilius.username";
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";

export const COLUMN_ORDER: TaskStatus[] = ["to do", "in progress", "done"];
export const COLUMN_LABELS: Record<TaskStatus, string> = {
  "to do": "To Do",
  "in progress": "In Progress",
  "done": "Done",
};

export const EMPTY_GROUPED_TASKS: Record<TaskStatus, Task[]> = {
  "to do": [],
  "in progress": [],
  "done": [],
};

