import { useEffect, useState } from "react";
import Modal from "react-modal";
import { COLUMN_LABELS } from "../constants";
import type { FormSubmitHandler, Task, TaskDraft, TaskStatus } from "../types";

type TaskEditorModalProps = {
  mode: "create" | "edit";
  status: TaskStatus;
  task: Task | null;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (taskDraft: TaskDraft) => Promise<void>;
};

export const TaskEditorModal = ({
  mode,
  status,
  task,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: TaskEditorModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nextStatus, setNextStatus] = useState<TaskStatus>(status);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setNextStatus(task.status);
      return;
    }

    setTitle("");
    setDescription("");
    setNextStatus(status);
  }, [mode, status, task]);

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    await onSubmit({
      title: trimmedTitle,
      description: description.trim() ? description.trim() : null,
      status: nextStatus,
    });
  };

  const titleText = mode === "create" ? `Create Task (${COLUMN_LABELS[status]})` : "Edit Task";
  const submitText = mode === "create" ? "Create Task" : "Save Changes";

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-xl outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{titleText}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {error ? (
          <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black outline-none ring-blue-500 focus:ring-2"
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="task-description"
            >
              Description (optional)
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black outline-none ring-blue-500 focus:ring-2"
              placeholder="Task details"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="task-status">
              Status
            </label>
            <select
              id="task-status"
              value={nextStatus}
              onChange={(event) => setNextStatus(event.target.value as TaskStatus)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black outline-none ring-blue-500 focus:ring-2"
            >
              <option value="to do">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Saving..." : submitText}
          </button>
        </form>
      </div>
    </Modal>
  );
};
