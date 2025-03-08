export const getGradeDescription = (
  grade: string,
  className: string
): string => {
  const gradeMap: { [key: string]: string } = className.startsWith("SSS")
    ? {
        A: "Excellent",
        B: "Very Good",
        C: "Good",
        D: "Fair",
        E: "Pass",
        F: "Failed",
      }
    : {
        A: "Distinction",
        B: "Merit",
        C: "Pass",
        D: "Pass",
        E: "Pass",
        F: "Failed",
      };

  return gradeMap[grade] || "";
};

export const formatToInteger = (n: string | number) => {
  const number = typeof n === "string" ? parseFloat(n) : n;

  // Handle invalid inputs
  if (isNaN(number)) {
    return n
  }

  // Return the truncated integer value
  return Math.round(number);
};
