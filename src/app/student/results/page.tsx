"use client";

import { StudentLayout } from "@/components/student/dashboard/layout";
import { StudentResultPage } from "@/components/student/results";
import { ROLE } from "@/constants";
import withAuth from "@/hoc/withAuth";
import React from "react";

const StudentResult: React.FC = () => {
  return (
    <StudentLayout>
      <StudentResultPage />
    </StudentLayout>
  );
};

export default withAuth(StudentResult, { requiredRole: ROLE.student });
