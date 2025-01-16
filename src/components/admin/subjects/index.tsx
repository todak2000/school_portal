"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import DataTable, { DataTableColumn } from "@/components/table";
import { sampleSubjects } from "@/constants/schools";

const columns: DataTableColumn[] = [
  { key: "name", label: "Subject Name", sortable: true },
  { key: "subjectId", label: "Subject ID", sortable: false },
];

const AdminSubjectsPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);

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
          userType={user?.role ?? "student"}
          name={today}
          editTime={currentTime}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Number of Subjects", value: sampleSubjects?.length },
        ].map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* Projects Section */}
      <DataTable
        data={sampleSubjects}
        columns={columns}
        defaultForm={{ name: "", subjectId: "" }}
        searchableColumns={["name", "subjectId"]}
        filterableColumns={["name"]}
      />
    </main>
  );
});
AdminSubjectsPage.displayName = "AdminSubjectsPage";
export { AdminSubjectsPage };
