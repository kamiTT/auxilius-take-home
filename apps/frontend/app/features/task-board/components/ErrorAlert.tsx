type ErrorAlertProps = {
  message: string;
  className?: string;
};

export const ErrorAlert = ({ message, className = "" }: ErrorAlertProps) => {
  const baseClassName =
    "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";
  const combinedClassName = `${baseClassName} ${className}`.trim();
  let errorMessage = ''
  
  if (message.includes('NetworkError')) {
    errorMessage = 'An unexpected error occurred. Please try again.'
  }

  return <p className={combinedClassName}>{errorMessage || message}</p>;
};
