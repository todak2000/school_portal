/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import { DataTableColumn } from "@/components/table";
import { teachersArr } from "@/constants/schools";
import { setModal } from "@/store/slices/modal";
import { key } from "@/helpers/uniqueKey";
import { generateTeacherID } from "@/helpers/generateStudentID";
import FirebaseDataTable from "@/components/firebaseTable";
import Collection from "@/firebase/db";
import { updateUserDoc, userSignup } from "@/firebase/onboarding";

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
  { key: "teacherId", label: "Teacher ID", sortable: false },
  { key: "fullname", label: "Student Name", sortable: false },
  { key: "email", label: "Email", sortable: false },
  { key: "schoolId", label: "School", sortable: true },
  { key: "isSuperAdmin", label: "School Admin", sortable: true },
];

const AdminTeachersPage = React.memo(() => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [teachers, setTeachers] =
    useState<Record<string, string | boolean | string[]>[]>(teachersArr);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);

  const closeModal = () => {
    dispatch(
      setModal({
        open: false,
        type: "",
      })
    );
  };

  const handleCreateTeacher = async (
    data: Record<string, string | boolean | string[]>
  ) => {
    // Create a new teacher object
    const id = `${key()}`
    const newTeacher = {
      ...data,
      id, // Generate a unique ID
      teacherId: generateTeacherID(data.schoolId as string),
      isAdmin: true,
      isSuperAdmin: data.isSuperAdmin === "true",
      isDeactivated: false,
    };

    console.log(newTeacher, "teacher data");

    try {
      const res = await userSignup({
        ...newTeacher,
        name: data.fullname as string,
        email: data.email as string, // Ensure email is included
        password: 'Zxcvb@12345', // Ensure password is included
        role: "teacher", // Set the role appropriately
      });

      if (res.status === 200) {
        setTeachers(
          (prevTeachers: Record<string, string | boolean | string[]>[]) => [
            ...prevTeachers,
            newTeacher,
          ]
        );
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
      return res;
    } catch (error: any) {
      console.log("Signup teacher error:", error);
      return error;
    }
  };

  const handleEditTeacher = async(
    data: Record<string, string | boolean | string[]>
  ) => {
    // Update the item in the main data
    try {
      const res = await updateUserDoc(
        "teacher",
        data.id as string,
        data,
        user?.role as "admin"
      );

      if (res.status === 200) {
        setTeachers((prevTeachers: Record<string, string | boolean | string[]>[]) =>
          prevTeachers.map((teacher) =>
            teacher.id === data.id ? { ...teacher, ...data } : teacher
          )
        );
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
      return res;
    } catch (error: any) {
      console.log("Update error:", error);
      return error;
    }
  };

  const handleDeleteTeacher = (id: string) => {
    // Remove the teacher from the state
    setTeachers((prevTeachers: Record<string, string | boolean | string[]>[]) =>
      prevTeachers.filter((teacher) => teacher.id !== id)
    );
    closeModal();
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
        {[{ title: "Total Number of Teachers", value: totalCount }].map(
          (stat, index) => (
            <StatsCard key={index} title={stat.title} value={stat.value} />
          )
        )}
      </div>

      {/* Projects Section */}
      <FirebaseDataTable
        collectionName={Collection.Teachers}
        data={teachers}
        setTotalCount={setTotalCount}
        setData={setTeachers}
        columns={columns}
        defaultSort={{ field: "createdAt", direction: "desc" }}
        defaultForm={null}
        role="teacher"
        searchableColumns={["fullname"]}
        // filterableColumns={["classId", "schoolId", "isSuperAdmin"]}
        onCreate={handleCreateTeacher}
        onDelete={handleDeleteTeacher}
        onEdit={handleEditTeacher}
      />
      
    </main>
  );
});
AdminTeachersPage.displayName = "AdminTeachersPage";
export { AdminTeachersPage };
