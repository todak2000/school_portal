"use client";

import TanstackProvider from "@/providers/TanstackProvider";
import React, { type ReactElement, type ReactNode } from "react";

const ProviderWrapper = ({
  children,
}: {
  children: ReactElement | ReactNode;
}) => {
  return <TanstackProvider>{children}</TanstackProvider>;
};

export default React.memo(ProviderWrapper);
