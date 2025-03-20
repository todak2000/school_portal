/* eslint-disable @typescript-eslint/no-explicit-any */
import Alert from "@/components/alert";
import { PaginationState } from "@/components/firebaseTable";
import LoaderSpin from "@/components/loader/LoaderSpin";
import Collection from "@/firebase/db";
import CRUDOperation from "@/firebase/functions/CRUDOperation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ResultsQueryParams {
  classId: string;
  subjectId: string;
  session: string;
  term: string;
  schoolId: string;
}
const firebaseService = new CRUDOperation(Collection.Results);

// Grade description utility function
const getGradeDescription = (grade: string): string => {
  const descriptions: Record<string, string> = {
    A: "Excellent",
    B: "Very Good",
    C: "Good",
    D: "Fair",
    E: "Poor",
    F: "Failed",
  };
  return descriptions[grade] || "N/A";
};

// Main component
interface ResultsTableProps {
  classId: string;
  subjectId: string;
  session: string;
  term: string;
  schoolId: string;
}

const ResultsTable = ({
  classId,
  subjectId,
  session,
  term,
  schoolId,
}: ResultsTableProps) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    isLoading: false,
  });
  // const [totalCount, setTotalCount]= useState<number>(0)
  const [data, setData] = useState<any>(null);
  const filters: {
    classLevel: string;
    schoolId: string;
    subject: string;
    session: string;
    term: number;
  } = {
    classLevel: classId,
    schoolId: schoolId,
    subject: subjectId,
    session,
    term: Number(term),
  };
  const searchTerm = "";
  const searchableColumns: string[] | undefined = [];
  const fetchResults = async ({
    classId,
    subjectId,
    session,
    term,
    schoolId,
  }: ResultsQueryParams) => {
    try {
      // Validate required parameters
      if (!classId || !subjectId || !session || !term || !schoolId) {
        throw new Error("Missing required parameters");
      }

      const result = await firebaseService.getPaginatedData<any>(
        paginationState.itemsPerPage,
        paginationState.currentPage,
        "dateRecorded",
        "desc",
        filters,
        searchTerm,
        searchableColumns
      );

      setData(result.items);
      setPaginationState((prev) => ({
        ...prev,
        totalPages: Math.ceil(result.totalCount / prev.itemsPerPage),
        isLoading: false,
      }));
      return result;
    } catch (error) {
      console.error("Error fetching results:", error);
      throw new Error("Failed to fetch results");
    }
  };
  const {
    // data: results,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["results", classId, subjectId, session, term, schoolId],
    queryFn: () =>
      fetchResults({ classId, subjectId, session, term, schoolId }),
    enabled: Boolean(classId && subjectId && session && term),
    // refetchInterval: 5000, // Real-time updates every 5 seconds
  });

  const tableHeaders = [
    "Student Name",
    "Class Work",
    "Term Exam",
    "Total",
    "Grade",
    "Remarks",
  ];

  if (!classId && !subjectId) {
    return (
      <div className="flex items-center justify-center p-4 pt-10 w-full md:w-1/2 mx-auto">
        <Alert
          message="Please Select a Class and a Subject to Proceed"
          type="warning"
        />
        ;
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoaderSpin />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-4 pt-10 w-full md:w-1/2 mx-auto">
        <Alert message={error.message as string} type="error" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center p-4 pt-10 w-full md:w-1/2 mx-auto">
        <Alert message="No results found" type="warning" />
      </div>
    );
  }

  return (
    <div className=" bg-white shadow-xl">
      <div className=" p-0">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full font-geistMono">
            <thead>
              <tr className="text-orange-300">
                {tableHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((result: any) => (
                <tr key={result.id} className="text-xs text-secondary">
                  <td>{result.name}</td>
                  <td>{result.scores.ca1}</td>
                  <td>{result.scores.exam}</td>
                  <td>{result.scores.total}</td>
                  <td>
                    <div className="badge bg-secondary text-white border-none">
                      {result.scores.grade}
                    </div>
                  </td>
                  <td>{getGradeDescription(result.scores.grade)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
