export const getGradeDescription = (grade: string): string => {
  const gradeMap: { [key: string]: string } = {
    A: "Excellent",
    B: "Very Good",
    C: "Good",
    D: "Fair",
    E: "Pass",
    F: "Failed",
  };

  return gradeMap[grade] || "Invalid grade";
};
