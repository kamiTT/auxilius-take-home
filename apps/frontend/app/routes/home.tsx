import type { Route } from "./+types/home";
import { LoginView } from "../features/task-board/components/LoginView";
import { TaskColumn } from "../features/task-board/components/TaskColumn";
import { COLUMN_ORDER } from "../features/task-board/constants";
import { useTaskBoard } from "../features/task-board/hooks/useTaskBoard";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Auxilius Task Board" },
    { name: "description", content: "Login and view tasks by status." },
  ];
};

const Home = () => {
  const {
    usernameInput,
    setUsernameInput,
    username,
    isLoading,
    error,
    groupedTasks,
    handleLogin,
    handleLogout,
  } = useTaskBoard();

  if (!username) {
    return (
      <LoginView
        usernameInput={usernameInput}
        onUsernameInputChange={setUsernameInput}
        onLogin={handleLogin}
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
            <TaskColumn key={status} status={status} tasks={groupedTasks[status]} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Home;
