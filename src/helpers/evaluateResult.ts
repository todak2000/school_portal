import { SubjectScore } from "@/components/studentResult/resultSheet";

interface EvaluationResult {
  decision: "Pass" | "Fail";
  principalComment: string;
  teacherComment: string;
}

// Map grades to numerical weights
const GRADE_WEIGHTS: { [key: string]: number } = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1, // Add E grade with weight 1
  F: 0,
};

export const evaluateStudentPerformance = (
  records: SubjectScore[]
): EvaluationResult => {
  // Calculate total score and count subjects
  let totalScore = 0;
  let totalSubjects = 0;

  records.forEach((record) => {
    const grade = record.scores.grade.toUpperCase(); // Ensure consistent case
    if (GRADE_WEIGHTS[grade] !== undefined) {
      totalScore += GRADE_WEIGHTS[grade];
      totalSubjects++;
    }
  });

  // Calculate average score
  const averageScore = totalScore / totalSubjects;

  // Determine performance category
  let performanceCategory = "";
  if (averageScore >= 4.5) {
    performanceCategory = "Excellent";
  } else if (averageScore >= 3.5) {
    performanceCategory = "Good";
  } else if (averageScore >= 2.5) {
    performanceCategory = "Average";
  } else {
    performanceCategory = "Poor";
  }

  // Decision Logic
  const failingCount = records.filter(
    (record) => record.scores.grade === "F"
  ).length;
  const hasEs = records.some((record) => record.scores.grade === "E");
  const decision = failingCount > 0 && averageScore < 2.5 ? "Fail" : "Pass"; // Fail if poor performance with failing grades

  // Principal's Comment
  let principalComment = "";
  switch (performanceCategory) {
    case "Excellent":
      principalComment = "Excellent Result! Keep up the great work.";
      break;
    case "Good":
      principalComment = "Good Performance! Keep doing well.";
      break;
    case "Average":
      principalComment = hasEs
        ? "Satisfactory Performance! Focus on improving weaker subjects."
        : "Satisfactory Performance! A Fair Result, Improve on weaker subjects.";
      break;
    case "Poor":
      principalComment =
        "Poor Performance! You must work harder and do better.";
      break;
  }

  // Teacher's Comment
  let teacherComment = "";
  switch (performanceCategory) {
    case "Excellent":
      teacherComment = "Excellent Performance";
      break;
    case "Good":
      teacherComment = "Good Result";
      break;
    case "Average":
      teacherComment = hasEs
        ? "Needs Improvement. Pay special attention to your weaker subjects"
        : "Average Performance";
      break;
    case "Poor":
      teacherComment =
        failingCount > 0
          ? "Needs Improvement: Work harder next term"
          : "Poor Performance. More effort needed to improve.";
      break;
  }

  // Return the result
  return {
    decision,
    principalComment,
    teacherComment,
  };
};
