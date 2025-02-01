"use client";
import { StudentResultView } from "@/components/studentResult";
import withAuth from "@/hoc/withAuth";
import React from "react";

const SchoolAdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center overflow-y-auto py-10 bg-gray-200 w-[100vw] min-h-screen">
      <StudentResultView />
    </div>
  );
};

export default withAuth(SchoolAdminDashboard, { requiredRole: "teacher" });
