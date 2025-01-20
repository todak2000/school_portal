/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
  DocumentSnapshot,
  orderBy,
  limit,
  startAfter,
  CollectionReference,
  DocumentData,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "..";

export const errMessage = "An unknown error occurred.";

// - CRUD
interface PaginatedResult<T> {
  items: T[];
  lastDoc: DocumentSnapshot | null;
  totalCount: number;
  totalOverallCount: number;
}

export default class CRUDOperation<T> {
  // -- collection name
  private collectionName: string;
  private cachedLastDocs: Map<number, DocumentSnapshot>;
  private totalDocuments: number;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.cachedLastDocs = new Map();
    this.totalDocuments = 0;
  }

  async getTotalCount(): Promise<number> {
    if (this.totalDocuments) return this.totalDocuments;

    try {
      const snapshot = await getDocs(collection(db, this.collectionName));
      this.totalDocuments = snapshot.size;
      return this.totalDocuments;
    } catch (error) {
      console.error("Error getting total count:", error);
      return 0;
    }
  }

  async getPaginatedData<T extends Record<string, any>>(
    pageSize: number,
    pageNumber: number,
    sortField: string = "createdAt",
    sortDirection: "asc" | "desc" = "desc",
    filters: Record<string, any> = {},
    searchTerm?: string,
    searchableColumns?: string[]
  ): Promise<PaginatedResult<T>> {
    try {
      // Start with base collection
      let baseQuery = collection(db, this.collectionName);
      // If there's a search term and searchable columns

      if (searchTerm && searchableColumns && searchableColumns?.length > 0) {
        const searchTermLower = searchTerm.toLowerCase();

        // Get all documents first (this is necessary for contains search)
        const querySnapshot = await getDocs(
          collection(db, this.collectionName)
        );

        // Filter documents that match the search term
        const matchedDocs = querySnapshot.docs.filter((doc) => {
          const data = doc.data();
          // Check each searchable column
          return searchableColumns.some((column) => {
            const value = data[column];
            // Handle different types of values
            if (typeof value === "string") {
              return value.toLowerCase().includes(searchTermLower);
            } else if (typeof value === "number") {
              return value.toString().includes(searchTermLower);
            } else if (Array.isArray(value)) {
              // Search through array values
              return value.some((item) =>
                String(item).toLowerCase().includes(searchTermLower)
              );
            }
            return false;
          });
        });

        // Apply sorting
        const sortedDocs = matchedDocs.sort((a, b) => {
          const aValue = a.get(sortField);
          const bValue = b.get(sortField);

          if (sortDirection === "asc") {
            return aValue < bValue ? -1 : 1;
          } else {
            return bValue < aValue ? -1 : 1;
          }
        });

        // Apply pagination
        const startIndex = (pageNumber - 1) * pageSize;
        const paginatedDocs = sortedDocs.slice(
          startIndex,
          startIndex + pageSize
        );

        const items = paginatedDocs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[];

        return {
          items,
          lastDoc: paginatedDocs[paginatedDocs.length - 1] || null,
          totalCount: matchedDocs.length,
          totalOverallCount: await this.getTotalCount(),
        };
      }
      // If no search term, proceed with regular query
      baseQuery = query(
        baseQuery,
        orderBy(sortField, sortDirection),
        limit(pageSize)
      ) as CollectionReference<DocumentData, DocumentData>;

      // Apply any filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          baseQuery = query(
            baseQuery,
            where(field, "==", value)
          ) as CollectionReference<DocumentData, DocumentData>;
        }
      });

      // If not first page, use startAfter with cached document
      if (pageNumber > 1) {
        const lastDoc = this.cachedLastDocs.get(pageNumber - 1);
        if (lastDoc) {
          baseQuery = query(
            baseQuery,
            startAfter(lastDoc)
          ) as CollectionReference<DocumentData, DocumentData>;
        } else {
          // If last doc not cached, fetch all previous pages
          const previousPageDoc = await this.fetchPreviousPage(
            pageSize,
            pageNumber - 1,
            sortField,
            sortDirection,
            filters
          );
          if (previousPageDoc) {
            baseQuery = query(
              baseQuery,
              startAfter(previousPageDoc)
            ) as CollectionReference<DocumentData, DocumentData>;
          }
        }
      }

      const querySnapshot = await getDocs(baseQuery);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as T[];

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (lastDoc) {
        this.cachedLastDocs.set(pageNumber, lastDoc);
      }

      return {
        items,
        lastDoc: lastDoc || null,
        totalCount: await this.getTotalCount(),
        totalOverallCount: await this.getTotalCount(),
      };
    } catch (error) {
      console.error("Error fetching paginated data:", error);
      return { items: [], lastDoc: null, totalCount: 0, totalOverallCount: 0 };
    }
  }
  private async fetchPreviousPage(
    pageSize: number,
    targetPage: number,
    sortField: string,
    sortDirection: "asc" | "desc",
    filters: Record<string, any>
  ): Promise<DocumentSnapshot | null> {
    let baseQuery = query(
      collection(db, this.collectionName),
      orderBy(sortField, sortDirection),
      limit(pageSize * targetPage)
    );

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        baseQuery = query(baseQuery, where(field, "==", value));
      }
    });

    const querySnapshot = await getDocs(baseQuery);
    const docs = querySnapshot.docs;

    // Cache all intermediate pages
    for (let i = 1; i <= targetPage; i++) {
      const pageLastDoc = docs[i * pageSize - 1];
      if (pageLastDoc) {
        this.cachedLastDocs.set(i, pageLastDoc);
      }
    }

    return docs[docs.length - 1] || null;
  }

  // Method to clear cache when filters change
  clearCache(): void {
    this.cachedLastDocs.clear();
    this.totalDocuments = 0;
  }
  // -- add item

  async add(modelName: Record<string, string> | any) {
    try {
      const firestoreDoc = doc(db, this.collectionName, modelName.id);
      await setDoc(firestoreDoc, modelName);
    } catch (error: unknown) {
      throw new Error(errMessage);
    }
  }

  async addUnique(modelName: unknown, id: string) {
    try {
      const firestoreDoc = doc(db, this.collectionName, id);
      const snapShot = await getDoc(firestoreDoc);
      if (snapShot.exists()) {
        return {
          status: 401,
          message: "Already Exists",
        };
      }
      await setDoc(firestoreDoc, modelName);
      return {
        status: 200,
        message: "Succesful",
      };
    } catch (error: unknown) {
      throw new Error(errMessage);
    }
  }

  // -- get detail
  async getDetail(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      return docSnap.exists() ? (docSnap.data() as T) : null;
    } catch (error: unknown) {
      throw new Error(errMessage);
    }
  }

  //  -- get user details without pagination
  async getDataByUID(uid: string) {
    try {
      const docRef = doc(db, this.collectionName, uid);
      const docSnap = await getDoc(docRef);

      return docSnap.exists() ? docSnap.data() : null;
    } catch (error: unknown) {
      throw new Error(errMessage);
    }
  }

  async getDataByField(
    field: string,
    value: any
  ): Promise<Record<string, any> | null> {
    try {
      // Construct a query against the collection.
      const q = query(
        collection(db, this.collectionName),
        where(field, "==", value)
      );

      // Execute the query.
      const querySnapshot = await getDocs(q);

      // If no documents match the query, return null.
      if (querySnapshot.empty) {
        return null;
      }

      // Return the first document as an object instead of an array.
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error: any) {
      console.error(
        `Error fetching data by field "${field}" with value "${value}":`,
        error
      );
      return null;
    }
  }
  async getAllData(): Promise<Record<string, any>[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (error: any) {
      console.error(`Error fetching data:`, error);
      return [];
    }
  }
  async updateOptimized(
    id: string,
    newData: Partial<T>
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Get reference to the document
      const docRef = doc(db, this.collectionName, id);

      // Get current document data
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          message: "Document not found",
        };
      }

      // Perform the update with only changed fields
      await setDoc(docRef, newData, { merge: true });

      return {
        success: true,
        message: "Document updated successfully",
      };
    } catch (error) {
      console.error("Error updating document:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Update failed",
      };
    }
  }

  // Helper methods for the class
  private isObject(item: any): boolean {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  private areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;

    // For simple arrays
    if (arr1.every((item) => typeof item !== "object")) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    // For arrays containing objects
    return arr1.every((item, index) => {
      if (this.isObject(item)) {
        return JSON.stringify(item) === JSON.stringify(arr2[index]);
      }
      return item === arr2[index];
    });
  }

  private getNestedChanges(
    currentObj: Record<string, any>,
    newObj: Record<string, any>
  ): Record<string, any> {
    const changes: Record<string, any> = {};

    Object.entries(newObj).forEach(([key, value]) => {
      // Handle nested objects recursively
      if (this.isObject(value) && this.isObject(currentObj[key])) {
        const nestedChanges = this.getNestedChanges(currentObj[key], value);
        if (Object.keys(nestedChanges).length > 0) {
          changes[key] = nestedChanges;
        }
      }
      // Handle arrays
      else if (Array.isArray(value) && Array.isArray(currentObj[key])) {
        if (!this.areArraysEqual(currentObj[key], value)) {
          changes[key] = value;
        }
      }
      // Handle primitive values
      else if (value !== currentObj[key]) {
        changes[key] = value;
      }
    });

    return changes;
  }
  async deleteDocument(id: string): Promise<{
    success: boolean;
    message: string;
    deletedDoc?: T;
  }> {
    try {
      // Get document reference
      const docRef = doc(db, this.collectionName, id);

      // First get the document data (in case we need it for something)
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          message: "Document not found",
        };
      }

      const deletedData = docSnap.data() as T;

      // Delete the document
      await deleteDoc(docRef);

      // Clear cache after deletion
      this.clearCache();

      // Decrease total count
      this.totalDocuments = Math.max(0, this.totalDocuments - 1);

      return {
        success: true,
        message: "Document successfully deleted",
        deletedDoc: deletedData,
      };
    } catch (error) {
      console.error("Error deleting document:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Delete failed",
      };
    }
  }

  // Optional: Add a batch delete method for multiple documents
  async batchDelete(ids: string[]): Promise<{
    success: boolean;
    message: string;
    failedIds?: string[];
  }> {
    const failedIds: string[] = [];

    try {
      // Process deletions sequentially to avoid overwhelming Firebase
      for (const id of ids) {
        const result = await this.deleteDocument(id);
        if (!result.success) {
          failedIds.push(id);
        }
      }

      return {
        success: failedIds.length === 0,
        message:
          failedIds.length === 0
            ? "All documents successfully deleted"
            : `Failed to delete ${failedIds.length} documents`,
        failedIds: failedIds.length > 0 ? failedIds : undefined,
      };
    } catch (error) {
      console.error("Error in batch delete:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Batch delete failed",
        failedIds,
      };
    }
  }
}
