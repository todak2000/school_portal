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
import { Printer } from "lucide-react";

const termss = [
  { value: 1, label: "First Term" },
  { value: 2, label: "Second Term" },
  { value: 3, label: "Third Term" },
];

const StudentResultPage = React.memo(() => {
  const { user, role } = useSelector((state: RootState) => state.auth);
  const { sessions } = useFetchSessions();
  const current = getOngoingSession(sessions);

  const [canPrint, setCanPrint] = useState<boolean>(false)
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

  const handleStudentResult = (id: string) => {
    let r: string;
    switch (role) {
      case ROLE.admin:
        r = role;
        break;
      case ROLE.student:
        r = "student";
        break;
      default:
        r = "school_admin";
    }
    window.open(`/${r}/student/${id}`, "_blank");
  };

  return (
    <main className="flex-1 p-6 w-[100vw] md:min-w-[75vw] md:max-w-[80vw]">
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
        {session !== "" && term !== "" && canPrint &&(
          <button
            onClick={() => handleStudentResult(user?.id)}
            className="md:hidden btn btn-ghost gap-2 rounded-none bg-primary mt-3 text-white"
          >
            <Printer size={16} />
            Print Result
          </button>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-hide w-full lg:h-[50vh] ">
        <StudentResultView
          studentId={user?.id}
          session={session}
          term={term}
          setCanPrint={setCanPrint}
          schoolId={user?.schoolId}
        />
      </div>

      {session !== "" && term !== "" && canPrint && (
        <button
          onClick={() => handleStudentResult(user?.id)}
          className="hidden md:flex mx-auto btn btn-ghost gap-2 rounded-none bg-primary mt-3 text-white"
        >
          <Printer size={16} />
          Print Result
        </button>
      )}
    </main>
  );
});
StudentResultPage.displayName = "StudentResultPage";
export { StudentResultPage };
