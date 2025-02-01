"use client";

import { SchoolAdminLayout } from "@/components/school_admin/dashboard/layout";
import { SchoolAdminTeachersPage } from "@/components/school_admin/teachers";
import withAuth from "@/hoc/withAuth";
import React from "react";

const SchoolAdminDashboard: React.FC = () => {
  return (
    <SchoolAdminLayout>
      <SchoolAdminTeachersPage />
    </SchoolAdminLayout>
  );
};

export default withAuth(SchoolAdminDashboard, { requiredRole: "teacher" });
