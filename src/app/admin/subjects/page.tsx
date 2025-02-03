"use client";

import { AdminLayout } from "@/components/admin/layout";
import { AdminSubjectsPage } from "@/components/admin/subjects";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminSubjectsPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: ROLE.admin });
