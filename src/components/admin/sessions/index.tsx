 
"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  getFormattedCustomDate,
  getFormattedDate,
  getFormattedTime,
} from "@/helpers/getToday";
import { StatsCard } from "@/components/statsCard";
import { UserInfo } from "@/components/userInfo";
import DataTable, { DataTableColumn } from "@/components/table";
import {
  convertToFirebaseTimestamp,
  Session,
  sessionsArr,
  Term,
} from "@/constants/schools";
import { Check, Clock7, Hourglass } from "lucide-react";
import { ROLE } from "@/constants";

const TermComponent = ({ term }: { term: Term }) => {
  // Extracted rendering logic for session state
  let sessionStateContent;

  if (term.sessionState === "ongoing") {
    sessionStateContent = (
      <span className="flex flex-row items-center gap-2">
        <span className="font-medium  capitalize text-xs font-geistMono">
          {getFormattedCustomDate(term.start)}
        </span>
        <span className="font-medium capitalize font-geistMono">-</span>
        <span className="font-medium capitalize font-geistMono text-xs">
          {getFormattedCustomDate(term.end)}
        </span>
        <div className="flex items-center text-yellow-700 rounded-full text-sm w-max">
          <Hourglass size={14} className="stroke-2" />
        </div>
      </span>
    );
  } else if (term.sessionState === "completed") {
    sessionStateContent = (
      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm w-max">
        <Check size={14} className="stroke-2" />
        <span className="font-medium capitalize font-geistMono text-xs">
          Completed
        </span>
      </div>
    );
  } else {
    sessionStateContent = (
      <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm w-max">
        <Clock7 size={14} className="stroke-2" />
        <span className="font-medium capitalize font-geistMono text-xs">
          Not Started
        </span>
      </div>
    );
  }

  return <div className="space-y-2">{sessionStateContent}</div>;
};

const columns: DataTableColumn[] = [
  { key: "session", label: "Academic Session", sortable: false },
  {
    key: "firstTerm",
    label: "First Term",
    sortable: false,
    render: (term: Term) => <TermComponent term={term} />,
  },
  {
    key: "secondTerm",
    label: "Second Term",
    sortable: false,
    render: (term: Term) => <TermComponent term={term} />,
  },
  {
    key: "thirdTerm",
    label: "Third Term",
    sortable: false,
    render: (term: Term) => <TermComponent term={term} />,
  },
];

const AdminSessionPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [sessions, setSessions] = useState<Session[]>(sessionsArr);
  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);
  const handleCreateSession = (data: Record<string, string>) => {
    const newSession: Session = {
      session: data.session,
      year: "2022",
      firstTerm: {
        start: convertToFirebaseTimestamp(data.firstTermStart),
        end: convertToFirebaseTimestamp(data.firstTermEnd),
        sessionState: "not started",
      },
      secondTerm: {
        start: convertToFirebaseTimestamp(data.secondTermStart),
        end: convertToFirebaseTimestamp(data.secondTermEnd),
        sessionState: "not started",
      },
      thirdTerm: {
        start: convertToFirebaseTimestamp(data.thirdTermStart),
        end: convertToFirebaseTimestamp(data.thirdTermEnd),
        sessionState: "not started",
      },
    };

    // Update the classes state with the new class
    setSessions((prev: Session[]) => [newSession, ...prev]);
  };

  const handleEditSession = (data: Session) => {
    // Update the item in the main data
    setSessions((prev: Session[]) =>
      prev.map((cls) =>
        cls.session === data.session ? { ...cls, ...data } : cls
      )
    );
  };

  const handleDeleteSession = (session: string) => {
    // Remove the class from the state
    setSessions((prev: Session[]) =>
      prev.filter((cls) => cls.session !== session)
    );
  };

  return (
    <main className="flex-1 p-6">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Number of School Sessions", value: sessions?.length },
        ].map((stat) => (
          <StatsCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* Projects Section */}
      <DataTable
        data={sessions}
        columns={columns}
        defaultForm={{
          session: "",
          firstTermStart: "",
          firstTermEnd: "",
          secondTermStart: "",
          secondTermEnd: "",
          thirdTermStart: "",
          thirdTermEnd: "",
        }}
        editableKeys={[
          "session",
          "firstTermStart",
          "firstTermEnd",
          "secondTermStart",
          "secondTermEnd",
          "thirdTermStart",
          "thirdTermEnd",
        ]}
        searchableColumns={["session"]}
        filterableColumns={["session"]}
        onCreate={handleCreateSession}
        onDelete={handleDeleteSession}
        onEdit={handleEditSession}
        role="session"
      />
    </main>
  );
});
AdminSessionPage.displayName = "AdminSessionPage";
export { AdminSessionPage };
