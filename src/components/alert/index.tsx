import React from "react";

const Alert = ({
  message,
  type,
}: {
  message: string;
  type?: "error" | "success" | "warning";
}) => {
  return (
    <div
      role="alert"
      className={`alert ${
        type === "success"
          ? "alert-success"
          : type === "warning"
          ? "alert-warning"
          : "alert-error"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className='text-xs font-geistMono'>{message}!</span>
    </div>
  );
};
export default React.memo(Alert);
