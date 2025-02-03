 
"use client";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { UserInfo } from "@/components/userInfo";
import { Users } from "lucide-react";
import { setModal } from "@/store/slices/modal";
import ResultsTable from "./resultTable";
import {
  sampleClasses,
  sampleSubjects,
  sessionsArr,
} from "@/constants/schools";
import { getOngoingSession } from "@/helpers/ongoingSession";

const termss = [
  { value: 1, label: "First Term" },
  { value: 2, label: "Second Term" },
  { value: 3, label: "Third Term" },
];

const SchoolAdminResultPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const current = getOngoingSession(sessionsArr);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);
  const [classId, setClassId] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [session, setSession] = useState<string>(current?.session ?? "");
  const [term, setTerm] = useState<string>(
    current?.ongoingTerm?.toString() ?? ""
  );

  const dispatch = useDispatch();
  const createResultModal = () => {
    dispatch(
      setModal({
        open: true,
        type: "create-result",
        data: {
          schoolId: user?.schoolId,
        },
      })
    );
  };
  return (
    <main className="flex-1 p-6 md:min-w-[75vw]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2 font-geistMono">
          Hey, <b>{user?.fullname?.split(" ")[0] ?? `Admin`}!</b>
        </h1>

        <UserInfo
          userType={user?.role ?? "student"}
          name={today}
          editTime={currentTime}
        />
      </div>

      {/* Stats Grid */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Users className="text-orange-600" />
          </div>
          <div>
            <h2 className="font-medium font-geistMono">Dear School Admin</h2>
            <p className="text-orange-700 text-xs font-geistMono md:max-w-[80%]">
              Create a record of excellence and celebrate our students&apos;
              achievements!
            </p>
          </div>
        </div>
        <button
          onClick={createResultModal}
          className="px-4 py-2 text-xs hover:opacity-70 bg-orange-600 text-white rounded-none font-geistMono"
        >
          New Result Entry
        </button>
      </div>

      {/* Projects Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3 mb-6">
        <div className="form-control w-full">
          <label className="label" htmlFor="session">
            <span className="label-text font-bold text-primary font-sans">Session</span>
          </label>
          <select
            className="select select-bordered w-full bg-orange-100 font-geistMono text-secondary rounded-none"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="">Select Session</option>
            {sessionsArr.map((sess) => (
              <option key={sess.session} value={sess.session}>
                {sess.session}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="term">
            <span className="label-text font-bold text-primary font-sans">Term</span>
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
        <div className="form-control w-full">
          <label className="label" htmlFor="classId">
            <span className="label-text font-bold text-primary font-sans">Class</span>
          </label>
          <select
            className="select select-bordered w-full bg-orange-100 font-geistMono text-secondary rounded-none"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Select Class</option>
            {sampleClasses.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label" htmlFor="subjectId">
            <span className="label-text font-bold text-primary font-sans">Subject</span>
          </label>
          <select
            className="select select-bordered w-full bg-orange-100 font-geistMono text-secondary rounded-none"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Select Subject</option>
            {sampleSubjects.map((subj) => (
              <option key={subj.subjectId} value={subj.subjectId}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ResultsTable
        classId={classId}
        subjectId={subjectId}
        session={session}
        term={term}
        schoolId={user?.schoolId}
      />
    </main>
  );
});
SchoolAdminResultPage.displayName = "SchoolAdminResultPage";
export { SchoolAdminResultPage };
