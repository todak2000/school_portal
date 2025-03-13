"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import { DataTableColumn } from "@/components/table";
import Collection from "@/firebase/db";
import FirebaseSchoolDataTable from "@/components/firebaseTable/schoolTable";
import { DirectoryCard } from "@/components/directory/card";
import { Ban, Check } from "lucide-react";
import { ROLE } from "@/constants";
import useSchoolData from "@/hooks/useSchoolById";
import CentralLoader from "@/components/loader/centralLoader";

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

const StatusIcon: React.FC<{ status: boolean }> = ({ status }) => {
  return status ? (
    <Check color="green" className="mx-auto" />
  ) : (
    <Ban color="red" className="mx-auto" />
  );
};

// Columns with the avatar component
const columns: DataTableColumn[] = [
  {
    key: "avatar",
    label: "Avatar",
    sortable: false,
    render: (studentName) => <Avatar schoolName={studentName} />,
  },
  { key: "teacherId", label: "Teacher ID", sortable: false },
  { key: "fullname", label: "Teacher Name", sortable: false },
  { key: "email", label: "Email", sortable: false },
  { key: "schoolId", label: "School", sortable: true },
  // { key: "isSuperAdmin", label: "School Admin", sortable: true },
  {
    key: "isSuperAdmin",
    label: "School Admin",
    sortable: true,
    render: (isSuperAdmin) => <StatusIcon status={isSuperAdmin} />,
  },
];

type TeacherData = Record<string, string | boolean | string[]>;

const SchoolAdminTeachersPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);

  const { data } = useSchoolData(user?.schoolId);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);

  if (!data.name) {
    return <CentralLoader />;
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
            title: `Number of Teachers at ${user?.schoolId}`,
            value: data.teacherCount,
          },
        ].map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={Number(stat.value)}
          />
        ))}
      </div>

      {/* Projects Section */}
      <FirebaseSchoolDataTable
        collectionName={Collection.Teachers}
        data={teachers}
        setTotalCount={null}
        setData={setTeachers}
        columns={columns}
        defaultSort={{ field: "createdAt", direction: "desc" }}
        defaultForm={null}
        searchableColumns={["classId", "fullname", "email"]}
        onCreate={() => null}
        onDelete={() => null}
        onEdit={() => null}
        fieldValue={user?.schoolId}
        field="schoolId"
        role="school"
        filterData={""}
      />
    </main>
  );
});
SchoolAdminTeachersPage.displayName = "SchoolAdminTeachersPage";
export { SchoolAdminTeachersPage };
