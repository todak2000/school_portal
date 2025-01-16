"use client";

import { AdminLayout } from "@/components/admin/layout";
import { AdminSchoolsPage } from "@/components/admin/schools";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminSchoolsPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: "admin" });
