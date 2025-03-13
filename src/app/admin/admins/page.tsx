"use client";

import { AdminAdminPage } from "@/components/admin/admin";
import { AdminLayout } from "@/components/admin/layout";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminAdminPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: ROLE.admin });
