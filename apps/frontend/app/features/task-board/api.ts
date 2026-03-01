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

export const createUser = async (username: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (response.ok) {
    return;
  }

  let errorMessage = `Failed to create user (${response.status})`;
  try {
    const payload: { error?: string } = await response.json();
    if (payload.error) {
      errorMessage = payload.error;
    }
  } catch {
    // Ignore JSON parse failures and use fallback message.
  }

  throw new Error(errorMessage);
};
