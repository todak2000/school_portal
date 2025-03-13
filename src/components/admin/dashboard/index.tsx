"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { UserInfo } from "@/components/userInfo";
import { StatsCard } from "@/components/statsCard";
import {
  sampleClasses,
  sampleSeniorSubjects,
  sampleSubjects,
} from "@/constants/schools";
import { ROLE } from "@/constants";
import useAdminDashboard from "@/hooks/useAdminDashboard";

const AdminDashboardPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useAdminDashboard(user?.id);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);
  //
  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2 font-geistMono">
          Hey, <b>{user?.fullname?.split(" ")[0] ?? `Admin`}!</b>
        </h1>

        <UserInfo
          userType={user?.role ?? ROLE.student}
          name={today}
          editTime={currentTime}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {[
          {
            title: "Schools",
            value: data.schoolCount,
            route: "/admin/schools",
          },
          {
            title: "Subjects",
            value: sampleSubjects?.length + sampleSeniorSubjects?.length,
            route: "/admin/subjects",
          },
          {
            title: "Classes",
            value: sampleClasses?.length,
            route: "/admin/classes",
          },
          {
            title: "Students",
            value: data.studentCount,
            route: "/admin/students",
          },
          {
            title: "Teachers",
            value: data.teacherCount,
            route: "/admin/teachers",
          },
          { title: "Admins", value: data.adminCount, route: "/admin/admins" },
        ].map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={Number(stat.value)}
            route={stat.route}
          />
        ))}
      </div>
    </main>
  );
});
AdminDashboardPage.displayName = "AdminDashboardPage";
export { AdminDashboardPage };
