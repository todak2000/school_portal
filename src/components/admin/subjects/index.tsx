"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import DataTable, { DataTableColumn } from "@/components/table";
import { sampleSubjects, Subject } from "@/constants/schools";

const columns: DataTableColumn[] = [
  { key: "name", label: "Subject Name", sortable: true },
  { key: "subjectId", label: "Subject ID", sortable: false },
];

const AdminSubjectsPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [subjects, setSubjects] = useState<Subject[]>(sampleSubjects);
  const today = useMemo(() => getFormattedDate(), []);

  const currentTime = useMemo(() => getFormattedTime(), []);
  const handleCreateSubject = (data: Subject) => {
    // Update the classes state with the new class
    setSubjects((prev: Subject[]) => [data,...prev]);
  };
  

  const handleEditSubject = (data: Subject) => {
    // Update the item in the main data
    setSubjects((prev: Subject[]) =>
      prev.map((cls) =>
        cls.subjectId === data.subjectId ? { ...cls, ...data } : cls
      )
    );
  };

  const handleDeleteSubject = (subjectId: string) => {
    // Remove the class from the state
    setSubjects((prev: Subject[]) =>
      prev.filter((cls) => cls.subjectId !== subjectId)
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
          userType={user?.role ?? "student"}
          name={today}
          editTime={currentTime}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{ title: "Total Number of Subjects", value: subjects?.length }].map(
          (stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} />
          )
        )}
      </div>
      {/* Projects Section */}
      <DataTable
        data={subjects}
        editableKeys={["name", "subjectId"]}
        columns={columns}
        defaultForm={{ name: "", subjectId: "" }}
        searchableColumns={["name", "subjectId"]}
        filterableColumns={["name"]}
        onCreate={handleCreateSubject}
        onDelete={handleDeleteSubject}
        onEdit={handleEditSubject}
        role="subject"
      />
    </main>
  );
});
AdminSubjectsPage.displayName = "AdminSubjectsPage";
export { AdminSubjectsPage };
