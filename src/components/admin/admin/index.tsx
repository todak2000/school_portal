/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import { DataTableColumn } from "@/components/table";
import FirebaseDataTable from "@/components/firebaseTable";
import Collection from "@/firebase/db";
import { ROLE } from "@/constants";

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
    label: "Avatar",
    sortable: false,
    render: (studentName) => <Avatar schoolName={studentName} />,
  },
  { key: "fullname", label: "Student Name", sortable: false },
  { key: "email", label: "Email", sortable: false },
  { key: "isSuperAdmin", label: "School Admin", sortable: true },
];

type AdminData = Record<string, string | boolean | string[]>;

const AdminAdminPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [administrators, setAdministrators] = useState<AdminData[]>([]);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);

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
        {[{ title: "Total Administrators", value: totalCount }].map((stat) => (
          <StatsCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* Projects Section */}
      <FirebaseDataTable
        collectionName={Collection.Admins}
        data={administrators}
        setTotalCount={setTotalCount}
        setData={setAdministrators}
        columns={columns}
        defaultSort={{ field: "createdAt", direction: "desc" }}
        defaultForm={null}
        role={ROLE.teacher}
        searchableColumns={["fullname"]}
        onCreate={() => null}
        onDelete={() => null}
        onEdit={() => null}
      />
    </main>
  );
});
AdminAdminPage.displayName = "AdminAdminPage";
export { AdminAdminPage };
