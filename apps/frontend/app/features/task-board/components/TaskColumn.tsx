import { COLUMN_LABELS } from "../constants";
import type { Task, TaskStatus } from "../types";

type TaskColumnProps = {
  status: TaskStatus;
  tasks: Task[];
};

export const TaskColumn = ({ status, tasks }: TaskColumnProps) => (
  <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">{COLUMN_LABELS[status]}</h2>
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
        {tasks.length}
      </span>
    </div>
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            {task.description ? <p className="mt-1 text-sm text-gray-600">{task.description}</p> : null}
          </div>
        ))
      )}
    </div>
  </article>
);

