"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import DataTable, { DataTableColumn } from "@/components/table";
import { schoolsArr } from "@/constants/schools";
import { generateSchoolCode } from "@/helpers/generateStudentID";
import { getInitials } from "@/helpers/getInitials";
import { ROLE } from "@/constants";

// Avatar component to display the school logo
const Avatar: React.FC<{ schoolName: string }> = ({ schoolName }) => {
  // Function to get the initial letters
  
  // Function to generate a random orange color
  const randomOrangeColor = (): string => {
    const colors = ["bg-orange-500", "bg-orange-600", "bg-orange-700"]; // Tailwind CSS classes for orange shades
    return colors[Math.floor(Math.random() * colors?.length)];
  };

  // Initials and color class for the avatar
  const initials = getInitials(schoolName);
  const bgColor = randomOrangeColor();

  return (
    <div
      className={`flex justify-center items-center w-10 h-10 rounded-full text-white font-bold ${bgColor}`}
    >
      {initials}
    </div>
  );
};

// Columns with the avatar component
const columns: DataTableColumn[] = [
  {
    key: "avatar",
    label: "Logo",
    sortable: false,
    render: (schoolName) => <Avatar schoolName={schoolName} />,
  },
  { key: "code", label: "School ID", sortable: false },
  { key: "name", label: "School Name", sortable: true },
  { key: "lga", label: "L.G.A", sortable: true },
];

const AdminSchoolsPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [schools, setSchools] =
    useState<Record<string, string | null>[]>(schoolsArr);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);

  const handleCreateSchool = (data: Record<string, string | null>) => {
    // Create a new school object
    const newSchool = {
      ...data,
      code: generateSchoolCode(data?.name as string, data.lga as string),
      avatar: null,
    };

    // Update the students state with the new student
    setSchools((prev: Record<string, string | null>[]) => [newSchool,...prev]);
  };

  const handleEditSchool = (data: Record<string, string | null>) => {
    // Update the item in the main data
    setSchools((prev: Record<string, string | null>[]) =>
      prev.map((school) =>
        school.code === data.code ? { ...school, ...data } : school
      )
    );
  };

  const handleDeleteSchool = (code: string) => {
    // Remove the school from the state
    setSchools((prev: Record<string, string | null>[]) =>
      prev.filter((school) => school.code !== code)
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
        {[{ title: "Total Number of Schools", value: schools?.length }].map(
          (stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} />
          )
        )}
      </div>

      {/* Projects Section */}
      <DataTable
        data={schools}
        columns={columns}
        editableKeys={["name", "lga", "description"]}
        defaultForm={{
          name: "",
          lga: "",
          code: "",
          description: "",
          avatar: null,
        }}
        searchableColumns={["name", "lga", "description"]}
        filterableColumns={["name", "lga"]}
        onCreate={handleCreateSchool}
        onDelete={handleDeleteSchool}
        onEdit={handleEditSchool}
        role="school"
      />
    </main>
  );
});
AdminSchoolsPage.displayName = "AdminSchoolsPage";
export { AdminSchoolsPage };
