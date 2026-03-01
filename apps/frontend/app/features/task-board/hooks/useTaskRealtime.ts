import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { SOCKET_AUTH_TOKEN, SOCKET_BASE_URL } from "../constants";
import type { Task } from "../types";

const SOCKET_SCRIPT_ID = "auxilius-socket-io-client";

type SocketHandler = (payload: unknown) => void;

type SocketClient = {
  on: (eventName: string, handler: SocketHandler) => void;
  off: (eventName: string, handler: SocketHandler) => void;
  disconnect: () => void;
};

type SocketFactory = (url: string, options?: Record<string, unknown>) => SocketClient;

type SetTasks = Dispatch<SetStateAction<Task[]>>;

const loadSocketFactory = async (): Promise<SocketFactory | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  if (typeof window.io === "function") {
    return window.io as SocketFactory;
  }

  const scriptSource = `${SOCKET_BASE_URL.replace(/\/$/, "")}/socket.io/socket.io.js`;
  const existingScript = document.getElementById(SOCKET_SCRIPT_ID) as HTMLScriptElement | null;

  const waitForScript = (script: HTMLScriptElement) =>
    new Promise<void>((resolve, reject) => {
      if (script.dataset.loaded === "true" || typeof window.io === "function") {
        resolve();
        return;
      }

      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener("error", () => reject(new Error("Failed to load socket.io client")), {
        once: true,
      });
    });

  if (existingScript) {
    await waitForScript(existingScript);
    return typeof window.io === "function" ? (window.io as SocketFactory) : null;
  }

  const script = document.createElement("script");
  script.id = SOCKET_SCRIPT_ID;
  script.src = scriptSource;
  script.async = true;
  script.addEventListener("load", () => {
    script.dataset.loaded = "true";
  });
  document.body.appendChild(script);
  await waitForScript(script);

  return typeof window.io === "function" ? (window.io as SocketFactory) : null;
};

export const useTaskRealtime = (username: string | null, setTasks: SetTasks) => {
  useEffect(() => {
    if (!username) {
      return;
    }

    let socket: SocketClient | null = null;
    let isDisposed = false;

    const onTaskCreated: SocketHandler = (payload) => {
      const task = payload as Task;
      if (!task || !task.id) {
        return;
      }

      setTasks((currentTasks) => {
        const existingTask = currentTasks.find((item) => item.id === task.id);
        if (existingTask) {
          return currentTasks.map((item) => (item.id === task.id ? task : item));
        }

        return [task, ...currentTasks];
      });
    };

    const onTaskUpdated: SocketHandler = (payload) => {
      const task = payload as Task;
      if (!task || !task.id) {
        return;
      }

      setTasks((currentTasks) => {
        const exists = currentTasks.some((item) => item.id === task.id);
        if (!exists) {
          return [task, ...currentTasks];
        }

        return currentTasks.map((item) => (item.id === task.id ? task : item));
      });
    };

    const onTaskDeleted: SocketHandler = (payload) => {
      const { id } = (payload as { id?: string }) || {};
      if (!id) {
        return;
      }

      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== id));
    };

    const connectSocket = async () => {
      try {
        const socketFactory = await loadSocketFactory();
        if (!socketFactory || isDisposed) {
          return;
        }

        socket = socketFactory(SOCKET_BASE_URL, {
          auth: SOCKET_AUTH_TOKEN ? { token: SOCKET_AUTH_TOKEN } : undefined,
          transports: ["websocket", "polling"],
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection failed", error);
        });
        socket.on("task:created", onTaskCreated);
        socket.on("task:updated", onTaskUpdated);
        socket.on("task:deleted", onTaskDeleted);
      } catch {
        // Keep app functional without realtime if socket client fails to load.
      }
    };

    connectSocket();

    return () => {
      isDisposed = true;

      if (socket) {
        socket.off("task:created", onTaskCreated);
        socket.off("task:updated", onTaskUpdated);
        socket.off("task:deleted", onTaskDeleted);
        socket.disconnect();
      }
    };
  }, [username, setTasks]);
};
