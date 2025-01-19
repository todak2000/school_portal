"use client";

import { AdminLayout } from "@/components/admin/layout";
import { AdminStudentsPage } from "@/components/admin/students";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminStudentsPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: "admin" });
