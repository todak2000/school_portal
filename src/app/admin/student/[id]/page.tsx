"use client";

import { AdminLayout } from "@/components/admin/layout";

import { StudentResultView } from "@/components/studentResult";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center overflow-y-auto pt-10 bg-gray-200 w-[calc(100vw-270px)] min-h-screen">
      <StudentResultView />
      </div>
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: "admin" });
