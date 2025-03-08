/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Session } from "@/constants/schools";
import { SessionService } from "@/firebase/session";

const useFetchSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null | unknown>(null);

  // Memoize fetchData using useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res:any = await SessionService.getLatestSessions();
      setSessions(res.items); // Assuming 'items' contains the session data
    } catch (err: unknown) {
      console.error("Error fetching sessions:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies can be adjusted as needed

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { sessions, loading, error };
};

export default useFetchSessions;
