"use client";

import { signingOut } from "@/firebase/onboarding";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactElement, ReactNode } from "react";

const StudentLayout = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    const {push} = useRouter()
    const handleLogOut = async()=>{
      await signingOut()
      push('/')
    }
    return (
      <div>
        <h1 className="text-2xl font-bold">Student Panel</h1>
        <button onClick={handleLogOut}><Power /></button>
        {children}
      </div>
    );
  }
);

StudentLayout.displayName = "StudentLayout";
export { StudentLayout };
