import { useEffect, useMemo, useState } from "react";
import { createTask, createUser, fetchTasks, updateTask } from "../api";
import { USERNAME_STORAGE_KEY } from "../constants";
import type { FormSubmitHandler, Task, TaskDraft } from "../types";
import { groupTasksByStatus } from "../utils";

export const useTaskBoard = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextTasks = await fetchTasks();
        setTasks(nextTasks);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Failed to load tasks.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [username]);

  const groupedTasks = useMemo(() => {
    return groupTasksByStatus(tasks);
  }, [tasks]);

  const handleLogin: FormSubmitHandler = async (event) => {
    event.preventDefault();
    const trimmedUsername = usernameInput.trim();
    if (!trimmedUsername) return;

    setIsSubmittingLogin(true);
    setError(null);

    try {
      await createUser(trimmedUsername);
      window.localStorage.setItem(USERNAME_STORAGE_KEY, trimmedUsername);
      setUsername(trimmedUsername);
      setUsernameInput("");
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Failed to log in.";
      setError(message);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    setUsername(null);
    setTasks([]);
    setError(null);
  };

  const handleCreateTask = async (taskDraft: TaskDraft) => {
    const createdTask = await createTask(taskDraft);
    setTasks((currentTasks) => [createdTask, ...currentTasks]);
    return createdTask;
  };

  const handleUpdateTask = async (taskId: string, taskDraft: TaskDraft) => {
    const updatedTask = await updateTask(taskId, taskDraft);
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? updatedTask : task))
    );
    return updatedTask;
  };

  return {
    usernameInput,
    setUsernameInput,
    username,
    isLoading,
    isSubmittingLogin,
    error,
    groupedTasks,
    handleLogin,
    handleLogout,
    handleCreateTask,
    handleUpdateTask,
  };
};
