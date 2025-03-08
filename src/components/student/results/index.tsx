"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { UserInfo } from "@/components/userInfo";
import { getOngoingSession } from "@/helpers/ongoingSession";
import StudentResultView from "@/components/studentResult";
import { ROLE } from "@/constants";
import useFetchSessions from "@/hooks/useSchoolSessions";

const termss = [
  { value: 1, label: "First Term" },
  { value: 2, label: "Second Term" },
  { value: 3, label: "Third Term" },
];

const StudentResultPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { sessions } = useFetchSessions();
  const current = getOngoingSession(sessions);

  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);
  const [session, setSession] = useState<string>(current?.session ?? "");
  const [term, setTerm] = useState<string>(
    current?.ongoingTerm?.toString() ?? ""
  );

  const updateSessionAndTerm = useCallback(() => {
    if (current) {
      setSession(current?.session);
      setTerm(current?.ongoingTerm?.toString());
    }
  }, []);

  useEffect(() => {
    updateSessionAndTerm();
  }, [updateSessionAndTerm]);

  return (
    <main className="flex-1 p-6 md:min-w-[75vw]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2 font-geistMono">
          Hey, <b>{user?.fullname?.split(" ")[0] ?? `Admin`}!</b>
        </h1>

        <UserInfo
          userType={user?.role ?? ROLE.student}
          name={today}
          editTime={currentTime}
        />
      </div>

      {/* Projects Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3 mb-6">
        <div className="form-control w-full">
          <label className="label" htmlFor="session">
            <span className="label-text font-bold text-primary font-sans">
              Session
            </span>
          </label>
          <select
            className="select select-bordered w-full bg-orange-100 font-geistMono text-secondary rounded-none"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="">Select Session</option>
            {sessions.map((sess) => (
              <option key={sess.session} value={sess.session}>
                {sess.session}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="term">
            <span className="label-text font-bold text-primary font-sans">
              Term
            </span>
          </label>
          <select
            className="select select-bordered w-full bg-orange-100 font-geistMono text-secondary rounded-none"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            <option value="">Select Term</option>
            {termss.map((term) => (
              <option key={term.value} value={term.value}>
                {term.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mx-auto overflow-y-auto h-[50vh] scrollbar-hide w-[85vw] md:w-full">
        <StudentResultView
          studentId={user?.id}
          session={session}
          term={term}
          schoolId={user?.schoolId}
        />
      </div>
    </main>
  );
});
StudentResultPage.displayName = "StudentResultPage";
export { StudentResultPage };
