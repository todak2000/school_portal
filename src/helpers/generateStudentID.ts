/**
 * Generates a student ID in the format AKS/<lgaCode>/<year>/random six-digit number.
 * @param {string} lgaCode - The LGA code.
 * @returns {string} - The generated student ID.
 */
export const generateStudentID = (lgaCode: string): string =>{
    const year: number = new Date().getFullYear();
    const randomSixDigitNumber: number = Math.floor(100000 + Math.random() * 900000);
    return `AKS/${lgaCode}/${year}/${randomSixDigitNumber}`;
  }
  
  export const generateTeacherID = (schoolCode: string): string =>{
    const randomSixDigitNumber: number = Math.floor(100000 + Math.random() * 900000);
    return `AKS/${schoolCode}/${randomSixDigitNumber}`;
  }
  