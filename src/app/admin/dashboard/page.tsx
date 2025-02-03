"use client";
import { AdminDashboardPage } from "@/components/admin/dashboard";
import { AdminLayout } from "@/components/admin/layout";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminDashboardPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: ROLE.admin });
