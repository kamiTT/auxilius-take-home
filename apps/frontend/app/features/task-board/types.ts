import type { ComponentProps } from "react";

export type TaskStatus = "to do" | "in progress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
};

export type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

