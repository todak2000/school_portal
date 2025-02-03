/* eslint-disable @typescript-eslint/no-explicit-any */
// Firebase utility functions for result management

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  runTransaction,
  getDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "..";
import Collection from "../db";
export type Term = 1 | 2 | 3;
export type ClassLevel = "JSS1" | "JSS2" | "JSS3" | "SS1" | "SS2" | "SS3" | any;
export interface Result {
  id: string;
  studentId: string;
  subject: string;
  assignedStudentId: string;
  schoolId: string;
  name: string;
  classLevel: ClassLevel;
  term: Term;
  session: string;
  scores: {
    ca1: number;
    ca2: number;
    exam: number;
    total: number;
    grade: string;
    remarks: string;
  };
  dateRecorded: Date;
  lastModified: Date;
  recordedBy: string; // teacher's ID
}

export interface TermResult {
  studentId: string;
  term: Term;
  name: string;
  schoolId: string;
  session: string;
  assignedStudentId: string;
  classLevel: ClassLevel;
  results: Result[];
  termAverage: number;
  position: number;
  totalStudents: number;
  dateCalculated?: any;
  lastUpdated?: any;
  promotionStatus?: "promoted" | "retained" | "pending";
}
export const ResultService = {
  async recordSubjectResult(
    result: Omit<Result, "id" | "dateRecorded" | "lastModified">
  ) {
    try {
      // Check for existing result
      const resultsRef = collection(db, Collection.Results);
      const resultsQuery = query(
        resultsRef,
        where("studentId", "==", result.studentId),
        where("schoolId", "==", result.schoolId),
        where("subject", "==", result.subject),
        where("session", "==", result.session),
        where("term", "==", result.term)
      );

      const querySnapshot = await getDocs(resultsQuery);
      if (!querySnapshot.empty) {
        // Record already exists, return error
        return {
          status: 409,
          message: `Result for atleast one student exist for this subject:${result.subject}  in this session:${result.session} , and term:${result.term}  already exists. Modifications are not authorized.`,
        };
      }

      // Proceed to add new result
      const resultData = {
        ...result,
        dateRecorded: new Date(),
        lastModified: new Date(),
        scores: {
          ...result.scores,
          total: result.scores.ca1 + result.scores.ca2 + result.scores.exam,
          grade: calculateGrade(
            result.scores.ca1 + result.scores.ca2 + result.scores.exam
          ),
        },
      };

      await addDoc(collection(db, Collection.Results), resultData);
      return {
        status: 200,
        message: "Result added successfully.",
      };
    } catch (error) {
      console.error("Error recording result:", error);
      //   throw error;
      return {
        status: 500,
        message: "Result upload failed. Please try again.",
      };
    }
  },

  async getTermResult(
    studentId: string,
    term: Term,
    session: string,
    schoolId: string
  ): Promise<TermResult | null> {
    try {
      // First, get the student document to check for existing result
      const studentRef = doc(db, Collection.Students_Parents, studentId);
      const studentDoc = await getDoc(studentRef);

      if (!studentDoc.exists()) {
        throw new Error("Student not found");
      }

      const student = studentDoc.data() as Record<string, any>;

      // Find if there's an existing result for this term and session
      const existingResult = student.results?.find(
        (r: { term: number; session: string }) =>
          r.term === term && r.session === session
      );

      let termResultId: string | undefined;

      // Fetch results from the Results collection
      const resultsQuery = query(
        collection(db, Collection.Results),
        where("studentId", "==", studentId),
        where("schoolId", "==", schoolId),
        where("term", "==", typeof term === "string" ? Number(term) : term),
        where("session", "==", session)
      );
      const resultsSnapshot = await getDocs(resultsQuery);

      if (resultsSnapshot.empty) {
        return null;
      }
      const results = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dateRecorded: doc.data().dateRecorded.toDate(),
        lastModified: doc.data().lastModified.toDate(),
      })) as Result[];

      // Calculate average
      const totalScore = results.reduce(
        (sum, result) => sum + result.scores.total,
        0
      );
      const average = results.length > 0 ? totalScore / results.length : 0;

      // Get class results for positioning
      const classResultsQuery = query(
        collection(db, Collection.TermResult),
        where("schoolId", "==", schoolId),
        where("term", "==", term),
        where("session", "==", session),
        where("classLevel", "==", student.classId)
      );
      const classResults = await getDocs(classResultsQuery);
      const position = calculatePosition(average, classResults);

      const termResult: Omit<TermResult, "id"> = {
        studentId,
        name: student.fullname,
        schoolId,
        term,
        session,
        assignedStudentId: student.studentId,
        classLevel: student.classId,
        results,
        termAverage: average,
        position,
        totalStudents: classResults.size,
        dateCalculated: new Date(),
        lastUpdated: new Date(),
      };

      if (existingResult?.resultId) {
        // Update existing term result document
        const termResultRef = doc(
          db,
          Collection.TermResult,
          existingResult.resultId
        );
        const termResultDoc = await getDoc(termResultRef);

        if (termResultDoc.exists()) {
          const existingTermResult = termResultDoc.data() as Omit<
            TermResult,
            "id"
          >;
          const existingResults = existingTermResult.results;

          // Check if there are any new or modified results
          const newOrUpdatedResults = results.filter(
            (result) =>
              !existingResults.some(
                (existingResult) =>
                  existingResult.id === result.id &&
                  existingResult.lastModified === result.lastModified
              )
          );

          if (newOrUpdatedResults.length > 0) {
            // Update term result with new or modified results
            await runTransaction(db, async (transaction) => {
              transaction.update(termResultRef, termResult);
              const updatedResults = [
                ...(student.results || []).filter(
                  (r: { term: number; session: string }) =>
                    !(r.term === term && r.session === session)
                ),
                {
                  term,
                  session,
                  resultId: termResultRef.id,
                },
              ];
              transaction.update(studentRef, { results: updatedResults });
            });
          }

          return {
            ...termResult,
            id: termResultId,
          } as TermResult;
        }
      } else {
        // Create new term result document
        const newTermResultRef = doc(collection(db, Collection.TermResult));
        await runTransaction(db, async (transaction) => {
          transaction.set(newTermResultRef, termResult);
          const updatedResults = [
            ...(student.results || []).filter(
              (r: { term: number; session: string }) =>
                !(r.term === term && r.session === session)
            ),
            {
              term,
              session,
              resultId: newTermResultRef.id,
            },
          ];
          transaction.update(studentRef, { results: updatedResults });
        });
        termResultId = newTermResultRef.id;
      }

      return {
        ...termResult,
        id: termResultId,
      } as TermResult;
    } catch (error) {
      console.error("Error fetching/creating term result:", error);
      throw error;
    }
  },

  async getClassStudents(
    classLevel: ClassLevel,
    schoolId: string
  ): Promise<Record<string, any>[]> {
    try {
      const studentsQuery = query(
        collection(db, Collection.Students_Parents),
        where("classId", "==", classLevel),
        where("schoolId", "==", schoolId)
      );

      const studentsSnapshot = await getDocs(studentsQuery);

      return studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Record<string, any>[];
    } catch (error) {
      console.error("Error fetching class students:", error);
      throw error;
    }
  },

  // Function to fetch cached term results for class ranking
  async getCachedClassResults(
    classLevel: ClassLevel,
    term: Term,
    session: string
  ): Promise<TermResult[]> {
    const classResultsQuery = query(
      collection(db, "termResults"),
      where("classLevel", "==", classLevel),
      where("term", "==", term),
      where("session", "==", session)
    );

    const snapshot = await getDocs(classResultsQuery);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<TermResult, "id">; // Cast to Omit to ensure type safety
      return {
        ...data,
        id: doc.id, // Include the id property
      } as TermResult; // Cast to TermResult
    });
  },
};

// Helper functions
function calculateGrade(total: number): string {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 40) return "D";
  return "F";
}

function calculatePosition(
  average: number,
  classResults: QuerySnapshot
): number {
  const averages = classResults.docs
    .map((doc) => doc.data().termAverage)
    .filter((termAverage) => termAverage > average);
  return averages.length + 1;
}
