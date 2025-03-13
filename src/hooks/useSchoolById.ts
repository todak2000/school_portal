/* eslint-disable @typescript-eslint/no-explicit-any */
import { SchoolService } from '@/firebase/school';
import { useState, useEffect, useCallback } from 'react';

const useSchoolData = (schoolId?: string) => {
    const [data, setData] = useState<Record<string, string | number | null>>({
        teacherCount: 0,
        studentCount: 0,
      });
  const [error, setError] = useState<string|null>(null);

  // Optimized fetch function using useCallback
  const fetchSchoolData = useCallback(async () => {
    if (!schoolId) return;

    try {
      const response:  any = await SchoolService.getSingleSchoolData(schoolId);
      setData(response?.data);
    } catch (err:any) {
      console.error(err);
      setError(err);
    }
  }, [schoolId]);

  // Fetch data when schoolId changes
  useEffect(() => {
    fetchSchoolData();
  }, [fetchSchoolData]);

  return { data, error, refetch: fetchSchoolData };
};

export default useSchoolData;
