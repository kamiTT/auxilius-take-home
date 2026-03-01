import { API_BASE_URL } from "./constants";
import type { Task } from "./types";

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks (${response.status})`);
  }

  const payload: { tasks?: Task[] } = await response.json();
  return Array.isArray(payload.tasks) ? payload.tasks : [];
};

