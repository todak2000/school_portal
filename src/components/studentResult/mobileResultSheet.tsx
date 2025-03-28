"use client";
import { getSubjectName } from "@/helpers/getSubjectName";
import { formatToInteger, getGradeDescription } from "@/helpers/gradeRemarks";
import React from "react";
import Image from "next/image";
import { processStudentRecords } from "@/helpers/getStudentResult";
import { evaluateStudentPerformance } from "@/helpers/evaluateResult";
import { getPosition } from "@/helpers/getPosition";
import QRCodeComponent from "./qrCode";

export type IScores = {
  ca1: number | string;
  ca2: number | string;
  exam: number | string;
  grade: string;
  remarks: string;
  total: number | string;
  position: string;
  teacherSignature?: string;
};

export interface SubjectScore {
  id?: string;
  classLevel: string;
  name: string;
  schoolId: string;
  studentId: string;
  subject: string;
  scores: IScores;
  session: string;
  term: number;
  remarks?: string;
}

export interface DomainGrade {
  name: string;
  label: string;
  grade: string;
}

export interface GradeKey {
  grade: string;
  description: string;
  range: string;
}

export interface StudentInfo {
  studentId: string;
  schoolName: string;
  studentName: string;
  className: string;
  classNumber: number;
  sex: string;
  position?: string;
  term: string;
  nextTermBegins: string;
  studentAverage: string;
  session: string;
  date: string;
  year: string;
  classAverage?: string;
}

export interface ReportSheetProps {
  studentInfo: StudentInfo;
  subjectScores: SubjectScore[];
  affectiveDomainGrades: DomainGrade[];
  psychomotorDomainGrades: DomainGrade[];
}

interface InfoRowProps {
  items: { title: string; value: string | number | undefined }[];
}

const InfoRow: React.FC<InfoRowProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.title} className="flex items-center justify-start">
          <p className="font-semibold font-geistSans text-xs">{item.title}:</p>
          <p className="lg:border-b border-gray-400 text-xs font-geistMono text-black font-bold pl-2">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

interface StudentInfoSectionProps {
  studentInfo: StudentInfo;
}

const StudentInfoSection: React.FC<StudentInfoSectionProps> = ({
  studentInfo,
}) => {
  const {
    schoolName,
    studentName,
    className,
    classNumber,
    sex,
    position,
    term,
    date,
    year,
    session,
    classAverage,
  } = studentInfo;

  return (
    <div className=" p-1 space-y-2">
      <div className="flex flex-col sm:flex-row">
        <p className="font-semibold font-geistSans text-xs">NAME OF SCHOOL:</p>
        <p className="flex-1 lg:border-b border-gray-400 text-xs font-geistMono text-black font-bold ">
          {schoolName}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row">
        <p className="font-semibold font-geistSans text-xs">NAME OF STUDENT:</p>
        <p className="flex-1 lg:border-b border-gray-400 text-xs font-geistMono text-black font-bold">
          {studentName}
        </p>
      </div>

      <InfoRow
        items={[
          { title: "CLASS", value: className },
          { title: "NO. IN CLASS", value: classNumber },
          { title: "SEX", value: sex },
          { title: "POSITION", value: position },
        ]}
      />

      <InfoRow
        items={[
          { title: "TERM", value: getPosition(Number(term)) },
          { title: "DATE", value: `${date}, ${year}` },
          {
            title: "CLASS AVERAGE",
            value: formatToInteger(classAverage as string | number),
          },
          { title: "SESSION", value: session },
        ]}
      />
    </div>
  );
};

interface HeaderProps {
  className: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const educationLevel = className.startsWith("JSS") ? "JUNIOR" : "SENIOR";
  const SecondText = className.startsWith("JSS")
    ? "STATE UNIVERSAL BASIC EDUCATION BOARD"
    : "STATE SECONDARY EDUCATION BOARD";

  return (
    <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between mb-1">
      <div className="w-24 sm:w-32">
        <Image
          src="/coas.png"
          alt="Nigerian Coat of Arms"
          width={100}
          height={100}
          className="mx-auto sm:mx-0"
        />
      </div>
      <div className="text-center flex-1 mt-2 sm:mt-0">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 font-serif">
          GOVERNMENT OF AKWA IBOM STATE OF NIGERIA
        </h1>
        <p className="text-sm sm:text-base font-semibold text-gray-800 font-serif">
          {SecondText}
        </p>
        <p className="text-sm sm:text-base font-semibold text-gray-800 font-serif">
          CONTINUOS ASSESSMENT FOR {educationLevel} SECONDARY SCHOOLS
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 font-serif">
          TERMINAL REPORT
        </h2>
      </div>
    </div>
  );
};

interface GradeKeyProps {
  grades: GradeKey[];
  title?: string;
  subtitle?: string;
}

const GradeKey: React.FC<GradeKeyProps> = ({ grades, title, subtitle }) => {
  return (
    <div className="border-[0.5px] border-gray-400 px-1 text-[0.55rem]">
      {title && <div className="text-center font-geistSans">{title}</div>}
      {subtitle && <div className="text-center font-geistSans">{subtitle}</div>}
      <div className="grid grid-cols-2 ">
        {grades.map((item) => (
          <React.Fragment key={item.grade}>
            <div className="">{`${item.grade} = ${item.description}`}</div>
            <div>{item.range}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface AcademicTableProps {
  className: string;
  data: SubjectScore[];
  gradeKeys: {
    grade: string;
    description: string;
    range: string;
  }[];
  evaluationResults: {
    decision: string;
    principalComment: string;
    teacherComment: string;
  };
  studentId: string;
}

const AcademicTable: React.FC<AcademicTableProps> = ({
  className,
  data,
  evaluationResults,
  gradeKeys,
}) => {
  const tableHeaders = [
    { id: 1, label: "SUBJECTS", value: null },
    {
      id: 2,
      label: "CLASS WORK",
      value: className.startsWith("JSS") ? "(30%)" : "(40%)",
    },
    {
      id: 3,
      label: "TERM EXAMS",
      value: className.startsWith("JSS") ? "(70%)" : "(60%)",
    },
    { id: 4, label: "TOTAL SCORE", value: "(100%)" },
    { id: 5, label: "CLASS GRADES", value: null },
    { id: 7, label: "REMARKS", value: null },
    { id: 8, label: "TEACHER'S SIGNATURE", value: null },
  ];

  return (
    <div className="w-full pr-2 text-xs font-geistSans">
      <div className="text-center font-bold mb-1">
        ACADEMIC PROGRESS REPORT SUMMARIES
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-center">
              {tableHeaders.map((header) => (
                <th
                  key={header.id}
                  className={`${
                    header.label === "SUBJECTS" ? "w-40" : "max-w-2"
                  } border border-gray-400 text-[0.65rem] h-24`}
                >
                  <span
                    className={`${
                      header.label !== "SUBJECTS"
                        ? "[writing-mode:vertical-rl] [transform:rotate(180deg)]"
                        : ""
                    }`}
                  >
                    {header.label}
                  </span>
                  <br />
                  {header.value && (
                    <span className="text-[0.40rem]">{header.value}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: SubjectScore) => {
              const { scores, subject } = row;
              return (
                <tr
                  key={subject}
                  className="text-center font-geistMono text-black font-semibold"
                >
                  <td className="border border-gray-400 pl-1 text-left w-[250px]">
                    {getSubjectName(className, subject)}
                  </td>
                  <td className="border border-gray-400 w-[35px]">
                    {scores.ca1}
                  </td>
                  <td className="border border-gray-400 w-[35px]">
                    {scores.exam}
                  </td>
                  <td className="border border-gray-400 w-[35px]">
                    {scores.total}
                  </td>
                  <td className="border border-gray-400 w-[30px]">
                    {scores.grade}
                  </td>

                  <td className="border border-gray-400 w-[30px] text-[0.55rem]">
                    {getGradeDescription(scores.grade, className)}
                  </td>
                  <td className="border border-gray-400 text-left w-[30px]"></td>
                </tr>
              );
            })}
            <tr>
              <td className="border border-gray-400 p-1 font-bold font-geistMono">
                TOTAL
              </td>
              <td className="border border-gray-400 p-1"></td>
              <td className="border border-gray-400 p-1"></td>
              <td className="border border-gray-400 p-1"></td>
              <td className="border border-gray-400 p-1"></td>
              <td className="border border-gray-400 p-1 font-bold">
                {/* DECISION: */}
              </td>
              <td
                className="border border-gray-400 p-1 text-black text-center font-geistMono"
                colSpan={2}
              >
                {evaluationResults.decision}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="py-1">
        <div className="flex">
          <p className="font-semibold mr-2">CLASS TEACHER&#39;S REMARKS:</p>
          <p className="flex-1 border-b border-gray-400 font-geistMono text-xs text-black">
            {evaluationResults.teacherComment}
          </p>
        </div>
      </div>

      <div className="py-1">
        <div className="flex">
          <p className="font-semibold mr-2">PRINCIPAL&#39;S COMMENTS:</p>
          <p className="flex-1 border-b border-gray-400 font-geistMono text-xs text-black">
            {evaluationResults.principalComment}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-xs mt-0">
          <div className="grid grid-cols-2 text-[0.65rem]  px-1">
            {gradeKeys.map((item) => (
              <React.Fragment key={item.grade}>
                <div>{`${item.grade} = ${item.description}`}</div>
                <div>{item.range}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className=" p-2 mt-0">
          <div className="text-center font-geistSans mb-8">
            PRINCIPAL SIGNATURE AND DATE
          </div>
          <div className="pb-2 text-center"></div>
        </div>
      </div>
    </div>
  );
};

export const STANDARD_GRADES = [
  { grade: "A", description: "Excellent", range: "80% and Above" },
  { grade: "B", description: "Very Good", range: "70 - 79%" },
  { grade: "C", description: "Good", range: "60 - 69%" },
  { grade: "D", description: "Fair", range: "50 - 59%" },
  { grade: "E", description: "Poor", range: "Below 40%" },
];

export const JSS_GRADES = [
  { grade: "A", description: "Distinction", range: "80% and Above" },
  { grade: "B", description: "Merit", range: "60 - 79%" },
  { grade: "C", description: "Pass", range: "50 - 59%" },
  { grade: "F", description: "Fail", range: "0 - 49%" },
];

const MobileReportSheet: React.FC<ReportSheetProps> = ({
  studentInfo,
  subjectScores,
}) => {
  const { className, studentId } = studentInfo;
  const getGradeType = () => {
    return className.startsWith("JSS") ? JSS_GRADES : STANDARD_GRADES;
  };

  const data = processStudentRecords(subjectScores);

  const evaluationResults = evaluateStudentPerformance(data);

  return (
    <div className="bg-white w-[95vw] font-sans">
      <div className="bg-white border-gray-300 h-[1100px]">
        <div className="absolute inset-0 z-0 flex  items-center justify-center text-primary text-2xl  font-bold opacity-10">
          OFFICIAL REPORT SHEET
        </div>
        <div className="absolute inset-0 z-0 flex  items-center justify-center font-bold opacity-5">
          <Image
            src="/coas.png"
            alt="Nigerian Coat of Arms"
            width={100}
            height={100}
          />
        </div>
        <Header className={className} />
        <StudentInfoSection studentInfo={studentInfo} />

        <div className="flex mt-2">
          <AcademicTable
            className={className}
            data={data}
            evaluationResults={evaluationResults}
            gradeKeys={getGradeType()}
            studentId={studentInfo.studentId}
          />
        </div>
        <div className="  p-2 flex flex-row items-center justify-center w-full">
          <QRCodeComponent studentId={studentId} />
        </div>
      </div>
    </div>
  );
};

export default MobileReportSheet;
