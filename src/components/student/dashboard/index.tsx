/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { UserInfo } from "@/components/userInfo";
import UserProfileEdit from "@/components/profile";
import { ROLE } from "@/constants";

const StudentDashboardPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);

  
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);
 

const d = {user}
  return (
    <main className="flex-1 p-6 w-full">
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

      <div className="mx-auto">
      <UserProfileEdit data={d as Record<string, any>} />
      </div>

      
    </main>
  );
});
StudentDashboardPage.displayName = "StudentDashboardPage";
export { StudentDashboardPage };


