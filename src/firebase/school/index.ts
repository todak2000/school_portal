import Collection from "../db";
import { SchoolProps } from "@/constants/schools";
import CRUDOperation from "../functions/CRUDOperation";
import { key } from "@/helpers/uniqueKey";
import { Timestamp } from "firebase/firestore";

const schoolOperation = new CRUDOperation(Collection.School);
const studentOperation = new CRUDOperation(Collection.Students_Parents);
const teacherOperation = new CRUDOperation(Collection.Teachers);
export const SchoolService = {
  async createSchool(schoolData: SchoolProps) {
    try {
      const data = {
        id: `${key()}`,
        createdAt: Timestamp.fromDate(new Date()),
        ...schoolData,
      };
      await schoolOperation.add(data);
      return {
        status: 200,
        message: "New School added successfully.",
      };
    } catch (error) {
      console.error("Error adding school:", error);
      //   throw error;
      return {
        status: 500,
        message: "Creating school failed. Please try again.",
      };
    }
  },

  async getSingleSchoolData(schoolId: string) {
    try {
      if (!schoolId)
        return {
          status: 400,
          message: "School ID not provided. Please try again.",
        };
      const schoolData = await schoolOperation.getDataByField("code", schoolId);
      const studentCount = await studentOperation.getCountByFilter({
        schoolId,
      });
      const teacherCount = await teacherOperation.getCountByFilter({
        schoolId,
      });

      return {
        status: 200,
        message: "School data retrieved successfully.",
        data: { ...schoolData, studentCount, teacherCount },
      };
    } catch (error) {
      console.error("Error retrieving school:", error);
      //   throw error;
      return {
        status: 500,
        message: "Oops! an error occured",
      };
    }
  },

  async getAllSchoolData() {
    try {
      
      const allSchools = await schoolOperation.getAllData()
      
      const enrichedSchoolData = await Promise.all(
        allSchools.map(async (school) => {
          const [studentCount, teacherCount] = await Promise.all([
            studentOperation.getCountByFilter({ schoolId: school.code }),
            teacherOperation.getCountByFilter({ schoolId: school.code })
          ]);
          return {
            ...school,
            studentCount,
            teacherCount
          };
        })
      );
      
      return {
        status: 200,
        message: "All School data retrieved successfully.",
        data: enrichedSchoolData,
      };
    } catch (error) {
      console.error("Error retrieving schools:", error);
      //   throw error;
      return {
        status: 500,
        message: "Oops! an error occured",
      };
    }
  },
};
