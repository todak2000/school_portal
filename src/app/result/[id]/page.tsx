"use client";

import { StudentResultView } from "@/components/studentResult";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const GeneralResult: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="flex flex-col items-center overflow-y-auto py-10 bg-gray-200 w-[100vw] min-h-screen">
      <StudentResultView schoolId={user?.schoolId} />
    </div>
  );
};

export default GeneralResult;
