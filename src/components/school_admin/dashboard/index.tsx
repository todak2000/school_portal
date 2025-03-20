/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { UserInfo } from "@/components/userInfo";
import { StatsCard } from "@/components/statsCard";
import { DirectoryCard } from "@/components/directory/card";
import { ROLE } from "@/constants";
import useSchoolData from "@/hooks/useSchoolById";
import CentralLoader from "@/components/loader/centralLoader";

 
const SchoolAdminDashboardPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data } = useSchoolData(user?.schoolId);

  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);

  if (!data.name) {
    return (
      <CentralLoader />
    );
  }
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
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mb-6">
        <DirectoryCard
          data={
            data as {
              name: string;
              lga: string;
              description: string;
              avatar?: string | null;
              headerImage?: string;
              teacherCount: string;
              studentCount: string;
            }
          }
        />
        {[
          {
            title: "Students",
            value: data.studentCount,
            route: "/school_admin/schools",
          },
          {
            title: "Teachers",
            value: data.teacherCount,
            route: "/school_admin/subjects",
          },
        ].map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value as number}
            route={stat.route}
          />
        ))}
      </div>

      
    </main>
  );
});
SchoolAdminDashboardPage.displayName = "SchoolAdminDashboardPage";
export { SchoolAdminDashboardPage };
