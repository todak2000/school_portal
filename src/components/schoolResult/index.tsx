/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";

import { useParams } from "next/navigation";
import { schoolsArr } from "@/constants/schools";
import { SchoolCard } from "./card";
import LoaderSpin from "../loader/LoaderSpin";
import { SearchBar } from "./searchBar";
import Collection from "@/firebase/db";
import { Avatar } from "../admin/students";
import { DataTableColumn } from "../table";
import FirebaseSchoolDataTable from "../firebaseTable/schoolTable";

const SchoolResultPage = () => {
  const params = useParams<{ id: string }>();

  const { id } = params;

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [data, setData] = useState<
    Record<string, string | boolean | string[]>[]
  >([]);
  const [school, setSchool] = useState<{
    name: string;
    lga: string;
    code: string;
    description: string;
    avatar: null;
  } | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const columns: DataTableColumn[] = [
    {
      key: "avatar",
      label: "Passport",
      sortable: false,
      render: (studentName: string) => <Avatar schoolName={studentName} />,
    },
    { key: "studentId", label: "Student ID", sortable: false },
    { key: "fullname", label: "Student Name", sortable: false },
    { key: "email", label: "Email", sortable: false },
    { key: "schoolId", label: "School", sortable: true },
    { key: "classId", label: "Class", sortable: true },
  ];

  useEffect(() => {
    const s = schoolsArr.find((i) => i.code === id);
    setSchool(
      s as {
        name: string;
        lga: string;
        code: string;
        description: string;
        avatar: null;
      }
    );
  }, [id]);

  return (
    <div className="w-full min-h-[80vh] md:min-h-[50vh] md:m-4 p-4 bg-white min-w-[100vw] md:min-w-[75vw]">
      {id && school ? (
        <>
          <SchoolCard
            data={school}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            setSelectedSubject={setSelectedSubject}
            selectedSubject={selectedSubject}
            totalCount={totalCount}
          />
          <div className="my-4 md:hidden block">
            <SearchBar
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
            />
          </div>
          <FirebaseSchoolDataTable
            collectionName={Collection.Students_Parents}
            data={data}
            setTotalCount={setTotalCount}
            setData={setData}
            columns={columns}
            defaultSort={{ field: "createdAt", direction: "desc" }}
            defaultForm={null}
            searchableColumns={["classId", "fullname", "email"]}
            onCreate={() => null}
            onDelete={() => null}
            onEdit={() => null}
            fieldValue={id}
            field="schoolId"
            role="school"
            filterData={selectedClass}
          />
        </>
      ) : (
        <LoaderSpin />
      )}
    </div>
  );
};

export default React.memo(SchoolResultPage);
