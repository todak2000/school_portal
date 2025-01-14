"use client";

import React, { ReactElement, ReactNode } from "react";

const SchoolAdminLayout = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    return (
      <div>
        <h1 className="text-2xl font-bold">School Admin Panel</h1>
        {children}
      </div>
    );
  }
);

SchoolAdminLayout.displayName = "SchoolAdminLayout";
export { SchoolAdminLayout };
