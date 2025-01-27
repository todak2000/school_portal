/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassLevel, ResultService } from "@/firebase/results";
import { useState, useEffect } from "react";

export const CreateResult = ({
  classLevel,
  subject,
  schoolId,
}: {
  classLevel: ClassLevel;
  subject: string;
  schoolId: string;
}) => {
  const term = 1;
  const session = "2024/2025";
  const [students, setStudents] = useState<Record<string, any>[]>([]);
  const [scores, setScores] = useState<
    Record<
      string,
      {
        ca1: number;
        ca2: number;
        exam: number;
      }
    >
  >({});

  // Fetch students in this class
  useEffect(() => {
    const fetchStudents = async () => {
      const classStudents = await ResultService.getClassStudents(
        classLevel,
        schoolId
      );
      setStudents(classStudents);

      // Initialize scores
      const initialScores = classStudents.reduce(
        (acc, student) => ({
          ...acc,
          [student.studentId]: { ca1: 0, ca2: 0, exam: 0 },
        }),
        {}
      );
      setScores(initialScores);
    };

    fetchStudents();
  }, [classLevel, schoolId]);

  const handleScoreChange = (
    studentId: string,
    scoreType: "ca1" | "ca2" | "exam",
    value: number
  ) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [scoreType]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Record results for each student
      await Promise.all(
        students.map((student) =>
          ResultService.recordSubjectResult({
            studentId: student.studentId,
            subject,
            classLevel,
            term,
            schoolId,
            session,
            scores: {
              ...scores[student.studentId],
              total: 0, // Will be calculated in service
              grade: "", // Will be calculated in service
              remarks: "", // Will be calculated in service
            },
            recordedBy: "teacherId", // Replace with actual teacher ID
          })
        )
      );

      alert("Results recorded successfully!");
    } catch (error) {
      console.error("Error recording results:", error);
      alert("Error recording results. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Record Results - {subject}</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>School</th>
              <th>Class</th>
              <th>CA1 (30)</th>
              <th>CA2 (30)</th>
              <th>Exam (40)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="text-black">{student.studentId}</td>
                <td className="text-black">{student.fullname}</td>
                <td className="text-black">{student.schoolId}</td>
                <td className="text-black">{student.classId}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    className="input input-bordered w-20"
                    value={scores[student.id]?.ca1 || 0}
                    onChange={(e) =>
                      handleScoreChange(
                        student.id,
                        "ca1",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    className="input input-bordered w-20"
                    value={scores[student.id]?.ca2 || 0}
                    onChange={(e) =>
                      handleScoreChange(
                        student.id,
                        "ca2",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    className="input input-bordered w-20"
                    value={scores[student.id]?.exam || 0}
                    onChange={(e) =>
                      handleScoreChange(
                        student.id,
                        "exam",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Record Results
        </button>
      </div>
    </div>
  );
};
