"use client";

import { signingOut } from "@/firebase/onboarding";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { ReactElement, ReactNode } from "react";

const AdminLayout = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    const { push } = useRouter();
    const handleLogOut = async () => {
      await signingOut();
      push("/admin/onboarding/signin");
    };
    return (
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={handleLogOut}>
          <Power />
        </button>
        {children}
      </div>
    );
  }
);

AdminLayout.displayName = "AdminLayout";
export { AdminLayout };
