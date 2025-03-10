"use client";
import React, { useMemo } from "react";
import { Search, Download, Filter } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFormattedDate, getFormattedTime } from "@/helpers/getToday";
import { UserInfo } from "@/components/userInfo";
import { StatsCard } from "@/components/statsCard";
import { sampleClasses, sampleSeniorSubjects, sampleSubjects, schoolsArr } from "@/constants/schools";
import { ROLE } from "@/constants";

interface ProjectCardProps {
  logo: string;
  title: string;
  description: string;
  dueDate: string;
  team: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  logo,
  title,
  description,
  dueDate,
  team,
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
        {logo}
      </div>
      <div className="flex-grow">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className="flex -space-x-2">
        {team.map((member) => (
          <div
            key={member}
            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
          />
        ))}
      </div>
      <div className="text-sm text-gray-500">Due: {dueDate}</div>
    </div>
  </div>
);

const AdminDashboardPage = React.memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);

  const today = useMemo(() => getFormattedDate(), []);
  const currentTime = useMemo(() => getFormattedTime(), []);
  //
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Schools", value: schoolsArr?.length, route:'/admin/schools' },
          { title: "Subjects", value: sampleSubjects?.length + sampleSeniorSubjects?.length, route:'/admin/subjects' },
          { title: "Classes", value: sampleClasses?.length, route:'/admin/classes' },
          { title: "Students", value: "339", route:'/admin/students' },
          { title: "Teachers", value: "147", route:'/admin/teachers' },
          { title: "Admins", value: sampleClasses?.length, route:'/admin/admins' },
        ].map((stat) => (
          <StatsCard key={stat.title} title={stat.title} value={stat.value} route={stat.route} />
        ))}
      </div>

      {/* Projects Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-medium">On Going Task</h2>
              <p className="text-sm text-gray-500">
                Best performing employee ranking
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <ProjectCard
            logo="JS"
            title="Journey Scarves"
            description="Rebranding and Website Design"
            dueDate="Aug, 17 2024"
            team={["1", "2", "3", "4"]}
          />

          <ProjectCard
            logo="E"
            title="Edifier"
            description="Web Design & Development"
         
            dueDate="Aug, 17 2024"
            team={["1", "2"]}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-medium">Graphs and Analysis</h2>
              <p className="text-sm text-gray-500">
                Projects completed per month based on trends
              </p>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                <option>Month</option>
              </select>
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <Download size={20} />
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {/* Placeholder for chart bars */}
            {Array.from({ length: 9 }).map((_) => (
              <div
                key={_ as string}
                className="w-full bg-blue-100 rounded-t-lg"
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
          </div>
        </div>
      </div>
    </main>
  );
});
AdminDashboardPage.displayName = "AdminDashboardPage";
export { AdminDashboardPage };
