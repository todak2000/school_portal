/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { signingOut } from "@/firebase/onboarding";
import { setModal } from "@/store/slices/modal";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

const StudentLayout = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    const {push} = useRouter()
    const dispatch = useDispatch()
    const handleLogOut = async()=>{
      await signingOut()
      push('/')
    }
    useEffect(() => {
      dispatch(setModal({ open: false, type: "" }));
    }, [])
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
