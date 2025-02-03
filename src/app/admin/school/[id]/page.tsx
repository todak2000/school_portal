"use client";

import { AdminLayout } from "@/components/admin/layout";

import SchoolResult from "@/components/schoolResult";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <SchoolResult />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: ROLE.admin });
