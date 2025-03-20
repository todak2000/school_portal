/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
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
import MobileReportSheet from "./mobileResultSheet";

// Main Component
export const StudentResultView = ({
  studentId,
  session,
  term,
  schoolId,
  setCanPrint,
}: {
  studentId?: string;
  session?: string;
  term?: string;
  schoolId?: string;
  setCanPrint?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { id } = useParams<{ id: string }>();
  const studentIdd = studentId ?? id;
  const pathname = usePathname();
  const { sessions } = useFetchSessions();
  const current = getOngoingSession(sessions);
  const selectedSession = session ?? current?.session;
  const selectedTerm = term ?? current?.ongoingTerm;

  const handlePrint = () => {
    // Create a style element for print-specific rules
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
      /* Hide everything by default */
      body * {
        visibility: hidden;
      }
  
      /* Show only the printable content */
      #printable-content, #printable-content * {
        visibility: visible;
      }
  
      /* Ensure the printable content is positioned correctly */
      #printable-content {
        display: flex; /* Use flexbox for layout */
        flex-direction: column; /* Stack child elements vertically */
        align-items: center; /* Center content horizontally */
        justify-content: center; /* Center content vertically */
        
        width: 100%; /* Span the full width of the page */
        height: 100%; /* Span the full height of the page */
        padding: 20px; /* Add some padding for spacing */
        box-sizing: border-box; /* Include padding in the width/height calculation */
      }
  
      /* Remove any unwanted styles during printing */
      @media print {
        body {
          margin: 0; /* Removes default margins */
        }
        * {
          -webkit-print-color-adjust: exact !important; /* Prevent background graphics from being printed */
          print-color-adjust: exact !important; /* Cross-browser */
          background: none !important; /* Disable background graphics */
        }
      }
    `;

    // Append the style to the document's head
    document.head.appendChild(style);

    // Trigger the print dialog
    window && window.print();

    // Cleanup the style after printing
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  // const handlePrint = () => {
  //   // Create a print-specific style
  //   const style = document.createElement("style");
  //   style.type = "text/css";
  //   style.innerHTML = `
  //     @media print {
  //       body {
  //         margin: 0; /* Removes default margins */
  //       }
  //       * {
  //         -webkit-print-color-adjust: exact !important; /* Prevent background graphics from being printed */
  //         print-color-adjust: exact !important; /* Cross-browser */
  //         background: none !important; /* Disable background graphics */
  //       }
  //     }
  //   `;

  //   // Append the style to the document's head
  //   document.head.appendChild(style);

  //   // Trigger the print dialog
  //   window && window.print();

  //   // Cleanup the style after printing
  //   setTimeout(() => {
  //     document.head.removeChild(style);
  //   }, 1000);
  // };

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

  useEffect(() => {
    termResult && setCanPrint && setCanPrint(true);
    !termResult && setCanPrint && setCanPrint(false);
  }, [termResult]);

  if (isLoading || typeof termResult === "undefined") {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <LoaderSpin />
      </div>
    );
  }
  if (!termResult) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <p className="text-center">
          Oops! This student&#39;s result has not be collated yet!
        </p>
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
      studentId: studentIdd,
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
      <div className="block md:hidden p-2 overflow-x-auto scrollbar-hide">
        <MobileReportSheet {...reportData} />
      </div>
      <div className="md:block hidden">
        <ReportSheet {...reportData} />

        {pathname !== "/student/results" && (
          <button
            className="btn bg-orange-300 text-white border-none absolute top-2 right-4"
            onClick={handlePrint}
          >
            <Printer />
          </button>
        )}
      </div>
    </>
  );
};

export default StudentResultView;
