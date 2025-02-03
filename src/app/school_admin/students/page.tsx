"use client";

import { SchoolAdminLayout } from "@/components/school_admin/dashboard/layout";
import { SchoolAdminStudentsPage } from "@/components/school_admin/students";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const SchoolAdminDashboard: React.FC = () => {
  return (
    <SchoolAdminLayout>
      <SchoolAdminStudentsPage />
    </SchoolAdminLayout>
  );
};

export default withAuth(SchoolAdminDashboard, { requiredRole: ROLE.teacher });
