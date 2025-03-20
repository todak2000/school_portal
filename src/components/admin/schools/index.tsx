"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import { DataTableColumn } from "@/components/table";
import { getInitials } from "@/helpers/getInitials";
import { ROLE } from "@/constants";
import FirebaseSchoolDataTable from "@/components/firebaseTable/schoolTable";
import Collection from "@/firebase/db";

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
  const [totalCount, setTotalCount] = useState<number>(0);
  const [schools, setSchools] =
    useState<Record<string, string | null>[]>([]);
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
        {[{ title: "Total Schools", value: totalCount }].map(
          (stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} />
          )
        )}
      </div>

      {/* Projects Section */}
      <FirebaseSchoolDataTable
        collectionName={Collection.School}
        data={schools}
        setTotalCount={setTotalCount}
        setData={setSchools}
        columns={columns}
        defaultSort={{ field: "createdAt", direction: "desc" }}
        defaultForm={null}
        searchableColumns={["name", "lga", "description"]}
        onCreate={() => null}
        onDelete={() => null}
        onEdit={() => null}
        fieldValue={""}
        field=""
        role="school"
        filterData={""}
      />
    </main>
  );
});
AdminSchoolsPage.displayName = "AdminSchoolsPage";
export { AdminSchoolsPage };
