/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ResultService, Term, TermResult } from "@/firebase/results";
import { useParams } from "next/navigation";
import { getInitials } from "@/helpers/getInitials";
import Image from "next/image";
import LoaderSpin from "../loader/LoaderSpin";
import { getGradeDescription } from "@/helpers/gradeRemarks";
import { Printer } from "lucide-react";

// Constants
const SCHOOL_INFO = {
  id: "QISS-EK",
  name: "Akwa Ibom State Schools Result",
  logoPath: "/aks_logo1.webp",
  logoSize: 120,
};

const TERM_INFO = {
  term: 1 as Term,
  session: "2024/2025",
};

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

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case "A":
      return "#4ade80";
    case "B":
      return "#4ade80";
    case "C":
      return "#4ade80";
    case "D":
      return "#facc15";
    case "E":
      return "#facc15";
    case "F":
      return "#f87171";
    default:
      return "black";
  }
};
// Reusable Components
const SchoolHeader = () => (
  <>
    <div className="flex w-full items-center justify-center h-32">
      <div className="absolute w-48 h-48 bg-transparent rounded-full flex items-center justify-center">
        <Image
          src={SCHOOL_INFO.logoPath}
          alt="AKS Schools Logo"
          height={SCHOOL_INFO.logoSize}
          width={SCHOOL_INFO.logoSize}
          className="object-fit"
          priority
        />
      </div>
    </div>
    <p className="text-center mb-3 font-geistMono font-extrabold text-orange-500">
      {SCHOOL_INFO.name}
    </p>
  </>
);

const StudentInfo = ({
  name,
  schoolId,
  // studentId,
  classLevel,
  position,
  assignedStudentId,
  totalStudents,
  termAverage,
}: {
  name: string;
  schoolId: string;
  studentId: string;
  classLevel: string;
  position: number;
  assignedStudentId: string;
  totalStudents: number;
  termAverage: number;
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
            <span className="text-gray-700 font-geistMono">{schoolId}</span>
          </div>
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
      <InfoRow label="Session" value={TERM_INFO.session} />
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

const ResultsTable = ({ results }: { results: StudentScores[] }) => {
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
              className="border-none bg-orange-50 font-geistSans font-bold text-secondary"
            >
              <td>{result.subject}</td>
              <td>{result.scores.ca1}</td>
              <td>{result.scores.ca2}</td>
              <td>{result.scores.exam}</td>
              <td>{result.scores.total}</td>
              <td>{result.scores.grade}</td>
              <td>
                <span
                  className="text-xs w-full flex flex-row text-center items-center justify-centerfont-geistMono"
                  style={{ color: getGradeColor(result.scores.grade) }}
                >
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
export const StudentResultView = () => {
  const { id: studentId } = useParams<{ id: string }>();

  const handlePrint = () => {
    window && window.print();
  };
  const { data: termResult, isLoading } = useQuery<TermResult | any>({
    queryKey: ["termResult", studentId, TERM_INFO.term, TERM_INFO.session],
    queryFn: () =>
      ResultService.getTermResult(
        studentId,
        TERM_INFO.term,
        TERM_INFO.session,
        SCHOOL_INFO.id
      ),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderSpin />
      </div>
    );
  }

  return (
    <div
      id="result"
      className="bg-white rounded-none shadow-sm p-6 md:min-w-[595px] max-w-2xl w-full min-h-[842px] max-h-[900px] relative"
    >
      <SchoolHeader />
      <StudentInfo {...termResult} />

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 font-geistMono text-secondary">
          Term {TERM_INFO.term} Result
        </h2>
      </div>

      <ResultsTable results={termResult.results} />
      <button
        className="btn bg-orange-300 text-white border-none absolute top-2 right-4"
        onClick={handlePrint}
      >
        <Printer />
      </button>
    </div>
  );
};

export default StudentResultView;
