/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ResultService, Term, TermResult } from "@/firebase/results";
import { useParams, usePathname } from "next/navigation";
import LoaderSpin from "../loader/LoaderSpin";

import { Printer } from "lucide-react";
import { getOngoingSession } from "@/helpers/ongoingSession";
import { schoolsArr } from "@/constants/schools";
import ReportSheet from "./resultSheet";
import useFetchSessions from "@/hooks/useSchoolSessions";
import { activitiesData, behaviorData } from "@/constants/result";

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
  const { id } = useParams<{ id: string }>();
  const studentIdd = studentId ?? id;
  const pathname = usePathname()
  const { sessions } = useFetchSessions();
  const current = getOngoingSession(sessions);
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

  const resultDate = new Date(termResult.lastUpdated);
  // Extract the day and month
  const day = resultDate.getDate();
  const month = resultDate.toLocaleString("en-US", { month: "long" });
  const year = resultDate.getFullYear();

  const reportData = {
    studentInfo: {
      schoolName: school,
      studentName: termResult.name,
      className: termResult.classLevel,
      classNumber: termResult.totalStudents,
      sex: termResult.gender ?? "M",
      position: termResult.position,
      term: termResult.term,
      nextTermBegins: "N/A",
      studentAverage: termResult.termAverage,
      date: `${day} ${month}`,
      year: year.toString().slice(-2),
      session: termResult.session,
      classAverage: termResult.classAverageScore,
    },
    subjectScores: termResult.results,
    affectiveDomainGrades: behaviorData,
    psychomotorDomainGrades: activitiesData,
  };
  
  return (
    <>
      <ReportSheet {...reportData} />
      {pathname !== "/student/results" && (
        <button
          className="btn bg-orange-300 text-white border-none absolute top-2 right-4"
          onClick={handlePrint}
        >
          <Printer />
        </button>
      )}
    </>
  );
};

export default StudentResultView;
