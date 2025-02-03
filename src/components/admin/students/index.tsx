/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import { DataTableColumn } from "@/components/table";
import { setModal } from "@/store/slices/modal";
import { generateStudentID } from "@/helpers/generateStudentID";
import { key } from "@/helpers/uniqueKey";
import FirebaseDataTable from "@/components/firebaseTable";
import Collection from "@/firebase/db";
import { deleteUserDoc, updateUserDoc } from "@/firebase/onboarding";

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
  { key: "classId", label: "Class", sortable: true },
];

// Define a type alias for student data
type StudentData = Record<string, string | boolean | string[]>;

const AdminStudentsPage = React.memo(() => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [students, setStudents] = useState<StudentData[]>([]);
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
  const id = `${key()}`;
  const handleCreateStudent = (
    data: Record<string, string | boolean | string[]>
  ) => {
    // Create a new teacher object
    const newTeacher = {
      ...data,
      id, // Generate a unique ID
      studentId: generateStudentID(data.schoolId as string),
      isDeactivated: false,
    };

    // Update the students state with the new student
    setStudents((prev: StudentData[]) => [newTeacher, ...prev]);
    closeModal();
  };

  const handleEditStudent = async (
    data: Record<string, string | boolean | string[]>
  ) => {
    // Update the item in the main data
    try {
      const res = await updateUserDoc(
        "student",
        data.id as string,
        data,
        user?.role as "admin"
      );

      if (res.status === 200) {
        setStudents((prev: StudentData[]) =>
          prev.map((student) =>
            student.id === data.id ? { ...student, ...data } : student
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

  const handleDeleteStudent = async (id: string) => {
    // Remove the student from the state

    try {
      const res = await deleteUserDoc("student", id, user?.role as "admin");

      if (res.status === 200) {
        setStudents((prev: StudentData[]) =>
          prev.filter((student) => student.id !== id)
        );
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
      return res;
    } catch (error: any) {
      console.log("Delete error:", error);
      return error;
    }
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
        {[{ title: "Total Number of Students", value: totalCount }].map(
          (stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} />
          )
        )}
      </div>

      {/* Projects Section */}
      <FirebaseDataTable
        collectionName={Collection.Students_Parents}
        data={students}
        setTotalCount={setTotalCount}
        setData={setStudents}
        columns={columns}
        defaultSort={{ field: "createdAt", direction: "desc" }}
        defaultForm={null}
        searchableColumns={["fullname", "email", "guardian"]}
        onCreate={handleCreateStudent}
        onDelete={handleDeleteStudent}
        onEdit={handleEditStudent}
        role="student"
      />
    </main>
  );
});
AdminStudentsPage.displayName = "AdminStudentsPage";
export { AdminStudentsPage };
