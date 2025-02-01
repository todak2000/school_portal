"use client";

import { SchoolAdminLayout } from "@/components/school_admin/dashboard/layout";
import { SchoolAdminResultPage } from "@/components/school_admin/results";
import withAuth from "@/hoc/withAuth";
import React from "react";

const SchoolAdminDashboard: React.FC = () => {
  return (
    <SchoolAdminLayout>
      <SchoolAdminResultPage />
    </SchoolAdminLayout>
  );
};

export default withAuth(SchoolAdminDashboard, { requiredRole: "teacher" });
