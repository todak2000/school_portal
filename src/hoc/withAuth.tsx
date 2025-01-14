"use client";

import LoaderSpin from "@/components/loader/LoaderSpin";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface WithAuthOptions {
  requiredRole?: string;
}

const withAuth = (
  WrappedComponent: React.ComponentType,
  options?: WithAuthOptions
) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();
    const { user, loading, role } = useSelector(
      (state: RootState) => state.auth
    );
    const { requiredRole } = options || {};
    useEffect(() => {
      if (!loading) {
        if (!user) {
          if (requiredRole === "admin") {
            router.replace("/admin/onboarding/signin");
          } else {
            router.replace("/login");
          }
        } else if (requiredRole && role !== requiredRole) {
          router.replace("/unauthorized");
        }
      }
    }, [user, loading, role, requiredRole, router]);

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
