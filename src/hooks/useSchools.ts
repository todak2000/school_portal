/* eslint-disable @typescript-eslint/no-explicit-any */
import { SchoolService } from "@/firebase/school";
import { useState, useEffect, useCallback } from "react";

const useSchools = () => {
  const [data, setData] = useState<
    Record<string, string | number | null>[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Optimized fetch function using useCallback
  const fetchSchoolsData = useCallback(async () => {
    try {
      const response: any = await SchoolService.getAllSchoolData();
      setData(response?.data);
    } catch (err: any) {
      console.error(err);
      setError(err);
    }
  }, []);

  // Fetch data when schoolId changes
  useEffect(() => {
    fetchSchoolsData();
  }, [fetchSchoolsData]);

  return { data, error, refetch: fetchSchoolsData };
};

export default useSchools;
