import { useEffect, useMemo, useState } from "react";
import { fetchTasks } from "../api";
import { USERNAME_STORAGE_KEY } from "../constants";
import type { FormSubmitHandler, Task } from "../types";
import { groupTasksByStatus } from "../utils";

export const useTaskBoard = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin: FormSubmitHandler = (event) => {
    event.preventDefault();
    const trimmedUsername = usernameInput.trim();
    if (!trimmedUsername) return;

    window.localStorage.setItem(USERNAME_STORAGE_KEY, trimmedUsername);
    setUsername(trimmedUsername);
    setUsernameInput("");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    setUsername(null);
    setTasks([]);
    setError(null);
  };

  return {
    usernameInput,
    setUsernameInput,
    username,
    isLoading,
    error,
    groupedTasks,
    handleLogin,
    handleLogout,
  };
};

