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
  schoolId: string;
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
  // Record individual subject result
  async recordSubjectResult(
    result: Omit<Result, "id" | "dateRecorded" | "lastModified">
  ) {
    try {
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

  // Calculate term averages and positions
  //   async updateTermResult(
  //     studentId: string,
  //     term: Term,
  //     session: string,
  //     classLevel: ClassLevel
  //   ) {
  //     await runTransaction(db, async (transaction) => {
  //       // Get all results for the student in this term
  //       const resultsQuery = query(
  //         collection(db, Collection.TermResult),
  //         where("studentId", "==", studentId),
  //         where("term", "==", term),
  //         where("session", "==", session)
  //       );

  //       const resultsSnapshot = await getDocs(resultsQuery);
  //       const results = resultsSnapshot.docs.map(
  //         (doc) =>
  //           ({
  //             id: doc.id,
  //             ...doc.data(),
  //           } as Result)
  //       );

  //       // Calculate average
  //       const totalScore = results.reduce(
  //         (sum, result) => sum + result.scores.total,
  //         0
  //       );
  //       const average = results.length > 0 ? totalScore / results.length : 0;

  //       // Get class results for positioning
  //       const classResultsQuery = query(
  //         collection(db, Collection.TermResult),
  //         where("term", "==", term),
  //         where("session", "==", session),
  //         where("classLevel", "==", classLevel)
  //       );

  //       const classResults = await getDocs(classResultsQuery);
  //       const position = calculatePosition(average, classResults);

  //       // Update or create term result
  //       const termResult: TermResult = {
  //         studentId,
  //         term,
  //         session,
  //         classLevel,
  //         results,
  //         termAverage: average,
  //         position,
  //         totalStudents: classResults.size + 1,
  //       };

  //       // Check if the term result document already exists
  //       const termResultRef = doc(
  //         db,
  //         Collection.TermResult,
  //         `${studentId}_${term}_${session}`
  //       );
  //       const termResultDoc = await getDoc(termResultRef);

  //       if (termResultDoc.exists()) {
  //         // Update existing term result
  //         await updateDoc(termResultRef, {
  //           ...termResult,
  //           results: termResult.results.map((result) => ({
  //             ...result,
  //           })),
  //         });
  //       } else {
  //         // Create new term result
  //         await setDoc(termResultRef, termResult);
  //       }
  //     });
  //   },

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

      // If resultId exists, fetch from termResults
      if (existingResult?.resultId) {
        const termResultRef = doc(
          db,
          Collection.TermResult,
          existingResult.resultId
        );
        const termResultDoc = await getDoc(termResultRef);

        if (termResultDoc.exists()) {
          const termResultData = termResultDoc.data() as Omit<TermResult, "id">;
          return {
            ...termResultData,
            id: termResultDoc.id,
            dateCalculated: termResultData?.dateCalculated
              ? new Date(termResultData.dateCalculated)
              : null,
            lastUpdated: termResultData.lastUpdated
              ? new Date(termResultData.lastUpdated)
              : null,
            results: termResultData.results.map((result) => ({
              ...result,
              dateRecorded: result.dateRecorded
                ? new Date(result.dateRecorded)
                : null,
              lastModified: new Date(result.lastModified),
            })),
          } as TermResult;
        }
      }

      // If no existing result, create new results and term result
      const resultsQuery = query(
        collection(db, Collection.Results),
        where("studentId", "==", studentId),
        where("schoolId", "==", schoolId),
        where("term", "==", term),
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

      // Create new term result document
      const newTermResultRef = doc(collection(db, Collection.TermResult));
      const termResult: Omit<TermResult, "id"> = {
        studentId,
        name: student.fullname,
        schoolId,
        term,
        session,
        classLevel: student.classId,
        results,
        termAverage: average,
        position,
        totalStudents: classResults.size + 1,
        dateCalculated: new Date(),
        lastUpdated: new Date(),
      };

      // Use transaction to update both termResult and student documents
      await runTransaction(db, async (transaction) => {
        // Create the term result
        transaction.set(newTermResultRef, termResult);

        // Update student's results array
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

        transaction.update(studentRef, {
          results: updatedResults,
        });
      });

      return {
        ...termResult,
        id: newTermResultRef.id,
      } as TermResult;
    } catch (error) {
      console.error("Error fetching/creating term result:", error);
      throw error;
    }
  },

  // Handle promotion logic
//   async getTermsResult(
//     studentId: string,
//     session: string
//   ): Promise<TermResult[]> {
//     try {
//       // Query all terms for the student in the given session
//       const termResultsQuery = query(
//         collection(db, "termResults"),
//         where("studentId", "==", studentId),
//         where("session", "==", session)
//       );

//       const termResultsSnapshot = await getDocs(termResultsQuery);

//       if (termResultsSnapshot.empty) {
//         // If no results found, check if we need to calculate them
//         const resultsQuery = query(
//           collection(db, "results"),
//           where("studentId", "==", studentId),
//           where("session", "==", session)
//         );

//         const resultsSnapshot = await getDocs(resultsQuery);

//         if (resultsSnapshot.empty) {
//           return []; // No results found for any term
//         }

//         // Group results by term
//         const resultsByTerm = resultsSnapshot.docs.reduce((acc, doc) => {
//           const result = { id: doc.id, ...doc.data() } as Result;
//           if (!acc[result.term]) {
//             acc[result.term] = [];
//           }
//           acc[result.term].push(result);
//           return acc;
//         }, {} as Record<Term, Result[]>);

//         // Calculate and cache term results for each term
//         const termResults = await Promise.all(
//           Object.entries(resultsByTerm).map(async ([term, results]) => {
//             // Calculate average for this term
//             const totalScore = results.reduce(
//               (sum, result) => sum + result.scores.total,
//               0
//             );
//             const average =
//               results.length > 0 ? totalScore / results.length : 0;

//             // Get class results for positioning
//             const classResultsQuery = query(
//               collection(db, Collection.TermResult),
//               where("term", "==", parseInt(term)),
//               where("session", "==", session),
//               where("classLevel", "==", results[0].classLevel)
//             );

//             const classResults = await getDocs(classResultsQuery);
//             const position = calculatePosition(average, classResults);

//             // Create term result
//             const termResult: TermResult = {
//               studentId,
//               name: student.fullname,
//               schoolId,
//               term: parseInt(term) as Term,
//               session,
//               classLevel: results[0].classLevel,
//               results,
//               termAverage: average,
//               position,
//               totalStudents: classResults.size + 1,
//             };

//             // Cache the result
//             const termResultRef = doc(
//               db,
//               "termResults",
//               `${studentId}_${term}_${session}`
//             );
//             await setDoc(termResultRef, termResult);

//             return termResult;
//           })
//         );

//         return termResults;
//       }

//       // Return existing term results
//       return termResultsSnapshot.docs.map((doc) => {
//         const data = doc.data() as Omit<TermResult, "id">; // Cast to Omit to ensure type safety
//         return {
//           ...data,
//           id: doc.id, // Include the id property
//         } as TermResult; // Cast to TermResult
//       });
//     } catch (error) {
//       console.error("Error fetching terms result:", error);
//       throw error;
//     }
//   },

//   async processPromotion(studentId: string, session: string): Promise<string> {
//     try {
//       const termResults = await this.getTermsResult(studentId, session);

//       // Calculate yearly average
//       const yearlyAverage =
//         termResults.reduce((sum, term) => sum + term.termAverage, 0) /
//         termResults.length;

//       // Promotion criteria
//       const promotionStatus = yearlyAverage >= 50 ? "promoted" : "retained";

//       // Update student record if promoted
//       if (promotionStatus === "promoted") {
//         const studentRef = doc(db, "students", studentId);
//         const student = (await getDoc(studentRef)).data() as any;

//         const nextClass = getNextClass(student.currentClass);
//         if (nextClass) {
//           await updateDoc(studentRef, {
//             currentClass: nextClass,
//             currentTerm: 1,
//             currentSession: `${parseInt(session) + 1}/${parseInt(session) + 2}`,
//           });
//         }
//       }

//       return promotionStatus;
//     } catch (error) {
//       console.error("Error processing promotion:", error);
//       throw error;
//     }
//   },
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

// function getNextClass(currentClass: ClassLevel): ClassLevel | null {
//   const progression: Record<ClassLevel, ClassLevel> = {
//     JSS1: "JSS2",
//     JSS2: "JSS3",
//     JSS3: "SS1",
//     SS1: "SS2",
//     SS2: "SS3",
//     SS3: null,
//   };
//   return progression[currentClass];
// }

function calculatePosition(
  average: number,
  classResults: QuerySnapshot
): number {
  const averages = classResults.docs
    .map((doc) => doc.data().termAverage)
    .filter((termAverage) => termAverage > average);
  return averages.length + 1;
}
