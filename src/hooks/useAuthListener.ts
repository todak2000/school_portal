/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useDispatch } from "react-redux";
import { firebaseAuth } from "@/firebase";
import { setUser } from "@/store/slices/auth";
import { getUserDataConcurrently } from "@/firebase/onboarding";

const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (user: User | null) => {
        const userData = user ? await getUserDataConcurrently(user.uid) : null;

        if (userData) {
          delete userData.createdAt;
        }
        dispatch(setUser(userData as Record<string, any>));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuthListener;
