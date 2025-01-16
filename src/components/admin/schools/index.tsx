"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import DataTable, { DataTableColumn } from "@/components/table";
import { schoolsArr } from "@/constants/schools";

const columns: DataTableColumn[] = [
  { key: "code", label: "School ID", sortable: false },
  { key: "name", label: "School Name", sortable: true },
  { key: "lga", label: "L.G.A", sortable: true },

  { key: "lga", label: "L.G.A", sortable: true },
  { key: "description", label: "School Description", sortable: false },
  { key: "avatar", label: "Logo", sortable: false },
];

const AdminSchoolsPage = React.memo(() => {
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
          { title: "Total Number of Schools", value: schoolsArr?.length },
        ].map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* Projects Section */}
      <DataTable
        data={schoolsArr}
        columns={columns}
        defaultForm={{
          name: "",
          lga: "",
          code: "",
          description: "",
          avatar: null,
        }}
        searchableColumns={["name", "lga", "description"]}
        filterableColumns={["name", "lga"]}
      />
    </main>
  );
});
AdminSchoolsPage.displayName = "AdminSchoolsPage";
export { AdminSchoolsPage };
