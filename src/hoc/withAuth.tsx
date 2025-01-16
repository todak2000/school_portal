/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import LoaderSpin from "@/components/loader/LoaderSpin";
import { signingOut } from "@/firebase/onboarding";
import { RootState } from "@/store";
import { setUser } from "@/store/slices/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface WithAuthOptions {
  requiredRole?: string;
}

const withAuth = (
  WrappedComponent: React.ComponentType,
  options?: WithAuthOptions
) => {
  const Wrapper: React.FC = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, loading, role } = useSelector(
      (state: RootState) => state.auth
    );

    const localUser =
      typeof window !== "undefined"
        ? window.localStorage.getItem("aks_portal_user")
        : null;
    const jsonUser = localUser ? JSON.parse(localUser) : null;

    const { requiredRole } = options || {};

    useEffect(() => {
      if (!loading) {
        if (!user && !jsonUser) {
          if (requiredRole === "admin") {
            router.replace("/admin/onboarding/signin");
          } else {
            router.replace("/");
          }
        } else if (
          requiredRole &&
          ((role && role !== requiredRole) || jsonUser.role !== requiredRole)
        ) {
          signingOut().then(() => {
            router.replace("/unauthorized");
          });
        } else if (
          requiredRole &&
          ((role && role === requiredRole) || jsonUser.role === requiredRole)
        ) {
          !user && dispatch(setUser(jsonUser));
        }
      }
    }, [user, loading, role, requiredRole, router, jsonUser, dispatch]);

    if (loading || !user || (requiredRole && role !== requiredRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <LoaderSpin />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
