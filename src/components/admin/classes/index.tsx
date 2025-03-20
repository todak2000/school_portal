"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import DataTable, { DataTableColumn } from "@/components/table";
import { Class, sampleClasses } from "@/constants/schools";
import { generateClassId } from "@/helpers/generateStudentID";
import { ROLE } from "@/constants";

const columns: DataTableColumn[] = [
  { key: "name", label: "Class Name", sortable: true },
  { key: "classId", label: "Class ID", sortable: false },
];

const AdminClassPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [classes, setClasses] = useState<Class[]>(sampleClasses);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);
  const handleCreateClass = (data: Class) => {
    // Create a new class object
    const newSchool = {
      ...data,
      classId: generateClassId(data.name),
    };

    // Update the classes state with the new class
    setClasses((prev: Class[]) => [newSchool,...prev]);
  };

  const handleEditClass = (data: Class) => {
    // Update the item in the main data
    setClasses((prev: Class[]) =>
      prev.map((cls) =>
        cls.classId === data.classId ? { ...cls, ...data } : cls
      )
    );
  };

  const handleDeleteClass = (classId: string) => {
    // Remove the class from the state
    setClasses((prev: Class[]) =>
      prev.filter((cls) => cls.classId !== classId)
    );
  };
  
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{ title: "Total Classes", value: classes?.length }].map(
          (stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} />
          )
        )}
      </div>

      {/* Projects Section */}
      <DataTable
        data={classes}
        columns={columns}
        defaultForm={{ name: "", classId: "" }}
        editableKeys={["name"]}
        searchableColumns={["name", "classId"]}
        filterableColumns={["name", "classId"]}
        onCreate={handleCreateClass}
        onDelete={handleDeleteClass}
        onEdit={handleEditClass}
        role="class"
      />
    </main>
  );
});
AdminClassPage.displayName = "AdminClassPage";
export { AdminClassPage };
