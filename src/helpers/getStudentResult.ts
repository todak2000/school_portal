/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubjectScore } from "@/components/studentResult/resultSheet";
import { sampleSeniorSubjects, sampleSubjects } from "@/constants/schools";

// Define a priority list for subject arrangement
const subjectPriority = [
  "mth",
  "eng",
  "sci",
  "len",
  "efk",
  "frn",
  "soc",
  "cra",
  "mus",
  "agr",
  "phe",
  "bst",
  "rmi",
  "tdw",
  "wdw",
  "mtw",
  "mch",
  "ele",
  "lct",
  "hec",
  "cve",
  "cts",
  "bss",
];

const subjectSeniorPriority = [
  "mth",
  "eng",
  "fmt",
  "len",
  "cve",
  "frn",
  "phy",
  "chm",
  "bio",
  "hes",
  "ags",
  "geo",
  "eco",
  "crk",
  "phe",
  "gov",
  "hec",
  "mus",
  "com",
  "fia",
  "mar",
  "cts",
  "amc",
  "fna",
  "tyw",
  "ibb",
  "gma",
  "tdw",
  "fon",
];

export const processStudentRecords = (records: SubjectScore[]) => {
  if (!Array.isArray(records)) {
    throw new Error("Input must be an array of student records.");
  }

  return records.reduce((result: any, record: any) => {
    const isJSS = record.classLevel.startsWith("JSS");
    // Determine which subject set to use based on the class level
    const subjectsToUse = isJSS ? sampleSubjects : sampleSeniorSubjects;

    // Extract all subjects provided in the records for the same class level
    const existingSubjectIds = records
      .filter((rec) => rec.classLevel === record.classLevel)
      .map((rec) => rec.subject);

    // Identify missing subjects
    const missingSubjects = subjectsToUse.filter(
      (subject) => !existingSubjectIds.includes(subject.subjectId)
    );

    // Create default objects for missing subjects
    const missingSubjectsWithDefaultScores = missingSubjects.map((subject) => ({
      id: subject.subjectId, // No ID for generated records
      name: record.name,
      classLevel: record.classLevel,
      subject: subject.subjectId,
      term: record.term,
      session: record.session,
      scores: {
        ca1: "",
        ca2: "",
        exam: "",
        total: "",
        position: null,
        grade: "", // Indicating no grade
        remarks: "No score recorded",
      },
      dateRecorded: null,
    }));

    // Combine existing records and missing subjects
    const combinedRecords = [
      ...records.filter((rec) => rec.classLevel === record.classLevel),
      ...missingSubjectsWithDefaultScores,
    ];

    // Sort the combined records based on the priority list
    const priorityList = isJSS ? subjectPriority : subjectSeniorPriority;
    const sortedRecords = combinedRecords.sort((a, b) => {
      const aIndex = priorityList.indexOf(a.subject.toLowerCase());
      const bIndex = priorityList.indexOf(b.subject.toLowerCase());
      return (
        (aIndex === -1 ? Infinity : aIndex) -
        (bIndex === -1 ? Infinity : bIndex)
      );
    });

    // Avoid duplicate entries in the final result
    const uniqueRecords = result.concat(
      sortedRecords.filter(
        (rec) => !result.some((existingRec: any) => existingRec.id === rec.id)
      )
    );

    return uniqueRecords;
  }, []);
};
