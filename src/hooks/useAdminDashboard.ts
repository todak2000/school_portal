/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminService } from '@/firebase/admin';
import { useState, useEffect, useCallback } from 'react';

const useAdminDashboard = (userId?: string) => {
    const [data, setData] = useState<Record<string, string | number | null>>({
        teacherCount: 0,
        studentCount: 0,
        adminCount: 0,
        schoolCount:0
      });
  const [error, setError] = useState<string|null>(null);

  // Optimized fetch function using useCallback
  const fetchAdminData = useCallback(async () => {
    if (!userId) return;

    try {
      const response:  any = await AdminService.getAdminDashboardData(userId);
      setData(response?.data);
    } catch (err:any) {
      console.error(err);
      setError(err);
    }
  }, [userId]);

  // Fetch data when schoolId changes
  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return { data, error, refetch: fetchAdminData };
};

export default useAdminDashboard;
