"use client";

import React from "react";

const StudentDashboardPage = React.memo(() => {
  return <p className="text-white bg-red-500">Welcoem to Student Dashboard</p>;
});

StudentDashboardPage.displayName = "StudentDashboardPage";
export { StudentDashboardPage };
