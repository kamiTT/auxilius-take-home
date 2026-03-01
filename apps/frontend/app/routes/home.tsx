import type { Route } from "./+types/home";
import { useState } from "react";
import { LoginView } from "../features/task-board/components/LoginView";
import { TaskEditorModal } from "../features/task-board/components/TaskEditorModal";
import { TaskColumn } from "../features/task-board/components/TaskColumn";
import { COLUMN_ORDER } from "../features/task-board/constants";
import { useTaskBoard } from "../features/task-board/hooks/useTaskBoard";
import type { Task, TaskDraft, TaskStatus } from "../features/task-board/types";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Auxilius Task Board" },
    { name: "description", content: "Login and view tasks by status." },
  ];
};

const Home = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [activeStatus, setActiveStatus] = useState<TaskStatus>("to do");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskEditorError, setTaskEditorError] = useState<string | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  const {
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
    handleDeleteTask,
  } = useTaskBoard();

  const openCreateEditor = (status: TaskStatus) => {
    setEditorMode("create");
    setActiveStatus(status);
    setActiveTask(null);
    setTaskEditorError(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (task: Task) => {
    setEditorMode("edit");
    setActiveStatus(task.status);
    setActiveTask(task);
    setTaskEditorError(null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setTaskEditorError(null);
    setIsSavingTask(false);
    setIsDeletingTask(false);
  };

  const handleTaskSubmit = async (taskDraft: TaskDraft) => {
    setIsSavingTask(true);
    setTaskEditorError(null);

    try {
      if (editorMode === "create") {
        await handleCreateTask(taskDraft);
      } else if (activeTask) {
        await handleUpdateTask(activeTask.id, taskDraft);
      }
      closeEditor();
    } catch (taskError) {
      const message =
        taskError instanceof Error ? taskError.message : "Failed to save task. Please try again.";
      setTaskEditorError(message);
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleTaskDelete = async () => {
    if (!activeTask || editorMode !== "edit") {
      return;
    }

    setIsDeletingTask(true);
    setTaskEditorError(null);

    try {
      await handleDeleteTask(activeTask.id);
      closeEditor();
    } catch (taskError) {
      const message =
        taskError instanceof Error ? taskError.message : "Failed to delete task. Please try again.";
      setTaskEditorError(message);
    } finally {
      setIsDeletingTask(false);
    }
  };

  if (!username) {
    return (
      <LoginView
        usernameInput={usernameInput}
        onUsernameInputChange={setUsernameInput}
        onLogin={handleLogin}
        isSubmitting={isSubmittingLogin}
        error={error}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Task Board</h1>
            <p className="text-sm text-gray-600">Signed in as {username}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </header>

        {isLoading && <p className="mb-4 text-sm text-gray-600">Loading tasks...</p>}
        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {COLUMN_ORDER.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={groupedTasks[status]}
              onCreateTask={openCreateEditor}
              onEditTask={openEditEditor}
            />
          ))}
        </section>
      </div>

      {isEditorOpen ? (
        <TaskEditorModal
          mode={editorMode}
          status={activeStatus}
          task={activeTask}
          isSubmitting={isSavingTask}
          isDeleting={isDeletingTask}
          error={taskEditorError}
          onClose={closeEditor}
          onSubmit={handleTaskSubmit}
          onDelete={editorMode === "edit" ? handleTaskDelete : null}
        />
      ) : null}
    </main>
  );
};

export default Home;
