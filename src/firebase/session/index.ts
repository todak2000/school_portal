import Collection from "../db";
import { Session } from "@/constants/schools";
import CRUDOperation from "../functions/CRUDOperation";
import { key } from "@/helpers/uniqueKey";
import { Timestamp } from "firebase/firestore";

const sessionOperation = new CRUDOperation(Collection.Session);
export const SessionService = {
  async createSession(sessionData: Session) {
    try {
      const data = {
        id: `${key()}`,
        createdAt: Timestamp.fromDate(new Date()),
        ...sessionData,
      };
      await sessionOperation.add(data);
      return {
        status: 200,
        message: "New Session added successfully.",
      };
    } catch (error) {
      console.error("Error adding session:", error);
      //   throw error;
      return {
        status: 500,
        message: "Creating session failed. Please try again.",
      };
    }
  },

  async getLatestSessions() {
    try {
      const w = await sessionOperation.getPaginatedFilterData(10, 1);

      return w;
    } catch (error) {
      console.error("Error fetching latest sessions:", error);
      return {
        status: 500,
        message: "Fetching sessions failed. Please try again.",
      };
    }
  },
  async updateSessionTerm(
    docId: string,
    term: string,
    newSessionState: string
  ) {
    try {
      // Fetch the specific session document
      const sessionDoc = await sessionOperation.getDataByUID(docId);

      if (!sessionDoc) {
        return {
          status: 404,
          message: "Session document not found.",
        };
      }

      // Get current data and update the specified term
      if (!sessionDoc[term]) {
        return {
          status: 400,
          message: `Invalid term: ${term}. Term does not exist in the session document.`,
        };
      }

      sessionDoc[term].sessionState = newSessionState;

      // Update the session document with modified term
      await sessionOperation.updateOptimized(docId, sessionDoc);

      return {
        status: 200,
        message: `${term} updated successfully to "${newSessionState}".`,
      };
    } catch (error) {
      console.error("Error updating session term:", error);
      return {
        status: 500,
        message: "Updating session term failed. Please try again.",
      };
    }
  },
};
