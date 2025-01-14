import React, { ReactElement, ReactNode } from "react";
import Image from "next/image";

const OnboardingWrapper = React.memo(
  ({ children }: { children: ReactElement | ReactNode }) => {
    return (
      <div className="bg-gradient-to-r via-secondary from-secondary to-green-500 h-screen flex items-center justify-center md:p-4">
        <div className="bg-transparent rounded-none  w-full max-w-xl p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Form Section */}
            <div className="flex-1 space-y-6">{children}</div>

            {/* Decorative Elements */}
            <div className="hidden md:flex md:w-1/3 items-center justify-center relative">
              <div className="absolute w-48 h-48 bg-transparent rounded-full flex items-center justify-center">
                <Image
                  src="/aks_logo1.webp"
                  alt="AKS Schools Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute w-12 h-12 bg-pink-100 rounded-full -top-4 -left-4 animate-pulse" />
              <div className="absolute w-8 h-8 bg-green-100 rounded-full bottom-4 right-4 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OnboardingWrapper.displayName = "OnboardingWrapper";
export { OnboardingWrapper };
