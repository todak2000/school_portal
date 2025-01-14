"use client";

import React, { ReactElement, ReactNode } from "react";

const AdminLayout = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    return (
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        {children}
      </div>
    );
  }
);

AdminLayout.displayName = "AdminLayout";
export { AdminLayout };
