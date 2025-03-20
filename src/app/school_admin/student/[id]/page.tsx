"use client";
import { StudentResultView } from "@/components/studentResult";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const SchoolAdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex flex-col items-center overflow-y-auto p-2 lg:py-10 bg-white lg:bg-gray-200 w-[100vw] min-h-screen">
      <StudentResultView schoolId={user?.schoolId} />
    </div>
  );
};

export default withAuth(SchoolAdminDashboard, { requiredRole: ROLE.teacher });
