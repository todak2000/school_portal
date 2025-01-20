/**
 * Generates a student ID in the format AKS/<lgaCode>/<year>/random six-digit number.
 * @param {string} schoolCode - The LGA code.
 * @returns {string} - The generated student ID.
 */
export const generateStudentID = (schoolCode: string): string => {
  const year: number = new Date().getFullYear();
  const randomSixDigitNumber: number = Math.floor(
    100000 + Math.random() * 900000
  );
  return `AKS/${schoolCode}/${year}/${randomSixDigitNumber}`;
};

export const generateTeacherID = (schoolCode: string): string => {
  const randomSixDigitNumber: number = Math.floor(
    100000 + Math.random() * 900000
  );
  return `AKS/${schoolCode}/${randomSixDigitNumber}`;
};

export const generateSchoolCode = (name: string, lga: string): string => {
  // Split the school name into words
  const nameParts = name.split(" ");

  // Get the first letter of each word in the school name
  const nameAbbreviation = nameParts.map((word) => word.charAt(0)).join("");

  // Get the LGA abbreviation (assuming it's the first two letters of the LGA name)
  const lgaAbbreviation = lga
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");

  // Combine the name abbreviation and LGA abbreviation to form the code
  const code = `${nameAbbreviation}-${lgaAbbreviation}`;

  return code.toUpperCase();
};

export const generateClassId = (className: string): string => {
  const classParts = className.split(" ");
  const classId =
    classParts.map((part) => part.charAt(0)).join("") +
    classParts[classParts.length - 1];
  return classId.toUpperCase();
};
