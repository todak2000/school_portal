"use client";

import { StudentDashboardPage } from "@/components/student/dashboard";
import { StudentLayout } from "@/components/student/dashboard/layout";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const StudentDashboard: React.FC = () => {
  return (
    <StudentLayout>
      <StudentDashboardPage />
    </StudentLayout>
  );
};

export default withAuth(StudentDashboard, {
  requiredRole: ROLE.student,
});
