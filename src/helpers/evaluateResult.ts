import { SubjectScore } from "@/components/studentResult/resultSheet";

interface EvaluationResult {
  decision: "Pass" | "Fail";
  comment: string;
}

export const evaluateStudentPerformance = (
  records: SubjectScore[]
): EvaluationResult => {
  // Count the number of failing grades
  const failingCount = records.filter((record) => record.scores.grade === "F").length;

  if (failingCount >= 3) {
    // Student failed
    return {
      decision: "Fail",
      comment: `The student failed with ${failingCount} failing grades (F). Focus on improving the weak areas.`,
    };
  } else {
    // Student passed
    return {
      decision: "Pass",
      comment: `The student passed. Keep up the effort!`,
    };
  }
};
