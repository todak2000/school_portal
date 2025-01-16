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
} from "firebase/firestore";

import { db } from "..";

export const errMessage = "An unknown error occurred.";

// - CRUD

export default class CRUDOperation<T> {
  // -- collection name
  collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
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
}
