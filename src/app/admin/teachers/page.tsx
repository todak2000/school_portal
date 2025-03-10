"use client";

import { AdminLayout } from "@/components/admin/layout";
import { AdminTeachersPage } from "@/components/admin/teachers";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminTeachersPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: ROLE.admin });
