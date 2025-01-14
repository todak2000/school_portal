"use client";

import { SchoolAdminDashboardPage } from "@/components/school_admin/dashboard";
import { SchoolAdminLayout } from "@/components/school_admin/dashboard/layout";
import withAuth from "@/hoc/withAuth";
import React from "react";

const SchoolAdminDashboard: React.FC = () => {
  return (
    <SchoolAdminLayout>
      <SchoolAdminDashboardPage />
    </SchoolAdminLayout>
  );
};

export default withAuth(SchoolAdminDashboard, { requiredRole: "teacher" });
