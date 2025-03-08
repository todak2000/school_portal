import { sampleSeniorSubjects, sampleSubjects } from "@/constants/schools";

export const getSubjectName = (cls: string, subject: string) => {
  if (cls.startsWith("JSS") && subject.length === 3) {
    const result = sampleSubjects.find((item) => item.subjectId === subject);
    return result ? result.name : "Subject not found";
  } else if (cls.startsWith("SSS") && subject.length === 3) {
    const result = sampleSeniorSubjects.find(
      (item) => item.subjectId === subject
    );
    return result ? result.name : "Subject not found";
  } else if (subject.length > 3) {
    return subject; // Return the subject as-is if length > 3
  } else {
    return "Invalid input";
  }
};
