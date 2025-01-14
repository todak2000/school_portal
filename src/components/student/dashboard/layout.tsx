"use client";

import React, { ReactElement, ReactNode } from "react";

const StudentLayout = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    return (
      <div>
        <h1 className="text-2xl font-bold">Student Panel</h1>
        {children}
      </div>
    );
  }
);

StudentLayout.displayName = "StudentLayout";
export { StudentLayout };
