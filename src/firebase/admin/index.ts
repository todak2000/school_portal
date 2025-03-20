/* eslint-disable @typescript-eslint/no-explicit-any */
import Collection from "../db";
import CRUDOperation from "../functions/CRUDOperation";

const schoolOperation = new CRUDOperation(Collection.School);
const studentOperation = new CRUDOperation(Collection.Students_Parents);
const teacherOperation = new CRUDOperation(Collection.Teachers);
const adminOperation = new CRUDOperation(Collection.Admins);
export const AdminService = {
  async getAdminDashboardData(userId: string) {
    try {
      if (!userId)
        return {
          status: 400,
          message: "User ID not provided. Please try again.",
        };
      const userData: any = await adminOperation.getDetail(userId);
      if (!userData.isAdmin) {
        return {
          status: 400,
          message: "You are not authorized to access this data.",
        };
      }
      const schoolCount = await schoolOperation.getTotalCount();
      const studentCount = await studentOperation.getTotalCount();
      const teacherCount = await teacherOperation.getTotalCount();
      const adminCount = await adminOperation.getTotalCount();

      return {
        status: 200,
        message: "Admin Dashboard data retrieved successfully.",
        data: { schoolCount, studentCount, teacherCount, adminCount },
      };
    } catch (error) {
      console.error("Error retrieving Admin Daschboard data:", error);
      //   throw error;
      return {
        status: 500,
        message: "Oops! an error occured. Please try again.",
      };
    }
  },
};
