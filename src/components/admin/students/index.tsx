"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import DataTable, { DataTableColumn } from "@/components/table";
import { studentsArr } from "@/constants/schools";

// Avatar component to display the school logo
export const Avatar: React.FC<{ schoolName: string }> = ({ schoolName }) => {
  // Function to get the initial letters
  const getInitials = (name: string): string => {
    const words = name?.split(" ");
    const initials = words
      ?.slice(0, 3)
      ?.map((word) => word?.charAt(0))
      ?.join("");
    return initials?.toUpperCase();
  };

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
    label: "Passport",
    sortable: false,
    render: (studentName) => <Avatar schoolName={studentName} />,
  },
  { key: "studentId", label: "Student ID", sortable: false },
  { key: "fullname", label: "Student Name", sortable: false },
  { key: "email", label: "Email", sortable: false },
  { key: "schoolId", label: "School", sortable: true },
  { key: "gender", label: "gender", sortable: true },
  { key: "dob", label: "Date of Birth", sortable: false },
  { key: "classId", label: "Class", sortable: true },
  
];

const AdminStudentsPage = React.memo(() => {
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
        {[{ title: "Total Number of Students", value: studentsArr?.length }].map(
          (stat, index) => (
            <StatsCard key={index} title={stat.title} value={stat.value} />
          )
        )}
      </div>

      {/* Projects Section */}
      <DataTable
        data={studentsArr}
        columns={columns}
        editableKeys={['fullname', 'phone', 'guardian','gender','dob', 'address', 'schoolId', 'classId']}
        defaultForm={{
          name: "",
          lga: "",
          code: "",
          description: "",
          avatar: null,
        }}
        isMain={true}
        searchableColumns={["fullname", "email", "guardian"]}
        filterableColumns={[ "classId", "schoolId", 'gender']}
      />
    </main>
  );
});
AdminStudentsPage.displayName = "AdminStudentsPage";
export { AdminStudentsPage };
