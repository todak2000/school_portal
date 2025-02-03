"use client";
import { AdminLayout } from "@/components/admin/layout";
import { AdminSessionPage } from "@/components/admin/sessions";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminSessionPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: ROLE.admin });
