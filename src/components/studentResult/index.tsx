/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ResultService, Term, TermResult } from "@/firebase/results";
import { useParams } from "next/navigation";
import { getInitials } from "@/helpers/getInitials";
import Image from "next/image";
import LoaderSpin from "../loader/LoaderSpin";
import { getGradeDescription } from "@/helpers/gradeRemarks";
import { Printer } from "lucide-react";
import { getOngoingSession } from "@/helpers/ongoingSession";
import {
  sampleSeniorSubjects,
  sampleSubjects,
  schoolsArr,
  sessionsArr,
} from "@/constants/schools";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

// Constants
const AKS_INFO = {
  id: "AKSRP",
  name: "Akwa Ibom State Schools Result",
  logoPath: "/aks_logo1.webp",
  logoSize: 120,
};

// const TERM_INFO = {
//   term: 1 as Term,
//   session: "2024/2025",
// };

// Types
type StudentScores = {
  id: string;
  subject: string;
  scores: {
    ca1: number;
    ca2: number;
    exam: number;
    total: number;
    grade: string;
    remarks: string;
  };
};

// Reusable Components
const SchoolHeader = ({ school }: { school: string }) => (
  <>
    <div className="flex w-full items-center justify-center h-32">
      <div className="absolute w-48 h-48 bg-transparent rounded-full flex items-center justify-center">
        <Image
          src={AKS_INFO.logoPath}
          alt="AKS Schools Logo"
          height={AKS_INFO.logoSize}
          width={AKS_INFO.logoSize}
          className="object-fit"
          priority
        />
      </div>
    </div>
    <p className="text-center mb-3 font-geistMono font-extrabold text-orange-500">
      {AKS_INFO.name}
    </p>
    <p className="text-center mb-3 font-geistMono font-extrabold text-orange-500">
      {school}
    </p>
  </>
);

const StudentInfo = ({
  name,
  classLevel,
  position,
  assignedStudentId,
  totalStudents,
  termAverage,
  session,
}: {
  name: string;
  classLevel: string;
  position: number;
  assignedStudentId: string;
  totalStudents: number;
  termAverage: number;
  session: string;
}) => (
  <div className="flex flex-col gap-6 md:gap-0 md:flex-row items-start justify-between mb-8 border-t pt-8 border-t-orange-500">
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-secondary font-geistMono rounded-full flex items-center justify-center text-white text-2xl font-semibold">
          {getInitials(name)}
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-semibold font-geistMono text-black">
          {name}
        </h2>
        <div className="grid grid-rows-2 gap-x-1 gap-y-1 text-sm">
          <div>
            <span className="text-gray-700 font-geistMono">
              {assignedStudentId ?? ""}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-1 text-xs">
      <InfoRow label="Class" value={classLevel} />
      <InfoRow label="Session" value={session} />
      <InfoRow label="Position" value={`${position} of ${totalStudents}`} />
      <InfoRow label="Average" value={`${termAverage.toFixed(2)}%`} />
    </div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <p className="font-geistMono text-secondary">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

const ResultsTable = ({
  results,
  classLevel,
}: {
  results: StudentScores[];
  classLevel: string;
}) => {
  const tableHeaders = [
    "Subject",
    "CA1",
    "CA2",
    "Exam",
    "Total",
    "Grade",
    "Remarks",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="text-white font-geistMono border-none bg-orange-500 rounded-none">
            {tableHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              className="border-none bg-orange-50 font-geistMono font-normal text-secondary"
            >
              <td>
                {classLevel.startsWith("JSS")
                  ? sampleSubjects?.find((i) => i.subjectId === result.subject)
                      ?.name
                  : sampleSeniorSubjects?.find(
                      (i) => i.subjectId === result.subject
                    )?.name}
              </td>
              <td>{result.scores.ca1}</td>
              <td>{result.scores.ca2}</td>
              <td>{result.scores.exam}</td>
              <td>{result.scores.total}</td>
              <td>{result.scores.grade}</td>
              <td>
                <span className="text-xs w-full font-bold text-black flex flex-row text-center items-center justify-centerfont-geistMono">
                  {getGradeDescription(result.scores.grade)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Component
export const StudentResultView = ({
  studentId,
  session,
  term,
  schoolId,
}: {
  studentId?: string;
  session?: string;
  term?: string;
  schoolId?: string;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();
  const studentIdd = studentId ?? id;
  const current = getOngoingSession(sessionsArr);
  const selectedSession = session ?? current?.session;
  const selectedTerm = term ?? current?.ongoingTerm;
  const handlePrint = () => {
    window && window.print();
  };
  const { data: termResult, isLoading } = useQuery<TermResult | any>({
    queryKey: [
      "termResult",
      studentIdd,
      selectedTerm,
      selectedSession,
      schoolId,
    ],
    queryFn: () =>
      ResultService.getTermResult(
        studentIdd,
        selectedTerm as Term,
        selectedSession as string,
        schoolId as string
      ),
  });

  if (isLoading || typeof termResult === "undefined") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderSpin />
      </div>
    );
  }
  if (!termResult) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Oops! This student&#39;s result has not be collated yet!</p>
      </div>
    );
  }
  const schoolObj = schoolsArr.find((i) => i.code === termResult.schoolId);
  const school = `${schoolObj?.name}, ${schoolObj?.lga}`;
  return (
    <div
      id="result"
      className="bg-white mx-auto rounded-none shadow-sm p-6 md:min-w-[595px] max-w-2xl w-full min-h-[842px] max-h-[900px] relative"
    >
      <SchoolHeader school={school} />
      <StudentInfo {...termResult} session={session} />

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 font-geistMono text-secondary">
          Term {selectedTerm} Result
        </h2>
      </div>

      <ResultsTable
        results={termResult.results}
        classLevel={termResult.classLevel}
      />
      {user?.role !== "student" && (
        <button
          className="btn bg-orange-300 text-white border-none absolute top-2 right-4"
          onClick={handlePrint}
        >
          <Printer />
        </button>
      )}
    </div>
  );
};

export default StudentResultView;
