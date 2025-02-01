import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "..";
import Collection from "../db";

export const getTeacherAndStudentCountsPerSchool = async(schoolId: string): Promise<{ teacherCount: number; studentCount: number }> =>{
    try {
      // Create queries for teachers and students
      const teacherQuery = query(collection(db, Collection.Teachers), where("schoolId", "==", schoolId));
      const studentQuery = query(collection(db, Collection.Students_Parents), where("schoolId", "==", schoolId));
  
      // Execute queries in parallel using Promise.all()
      const [teacherSnapshot, studentSnapshot] = await Promise.all([
        getDocs(teacherQuery),
        getDocs(studentQuery),
      ]);
  
      // Count the number of documents in each snapshot
      const teacherCount = teacherSnapshot.size;
      const studentCount = studentSnapshot.size;
  
      return { teacherCount, studentCount };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it appropriately in the calling code
    }
  }