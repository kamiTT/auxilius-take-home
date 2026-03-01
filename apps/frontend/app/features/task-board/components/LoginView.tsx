import type { FormSubmitHandler } from "../types";

type LoginViewProps = {
  usernameInput: string;
  onUsernameInputChange: (value: string) => void;
  onLogin: FormSubmitHandler;
};

export const LoginView = ({ usernameInput, onUsernameInputChange, onLogin }: LoginViewProps) => (
  <main className="min-h-screen bg-gray-50 p-6">
    <div className="mx-auto mt-20 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">Enter a username to access the task board.</p>
      <form className="mt-6 space-y-3" onSubmit={onLogin}>
        <label className="block text-sm font-medium text-gray-700" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          value={usernameInput}
          onChange={(event) => onUsernameInputChange(event.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 !text-black outline-none ring-blue-500 placeholder:text-gray-400 focus:ring-2"
          placeholder="e.g. alex"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  </main>
);
