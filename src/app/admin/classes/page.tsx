"use client";
import { AdminClassPage } from "@/components/admin/classes";
import { AdminLayout } from "@/components/admin/layout";
import withAuth from "@/hoc/withAuth";
import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminClassPage />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard, { requiredRole: "admin" });
