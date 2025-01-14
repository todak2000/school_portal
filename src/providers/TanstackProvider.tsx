"use client";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { useMemo } from "react";
import store from "@/store";

const TanstackProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  // const { store } = wrapper.useWrappedStore({});

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
};

export default TanstackProvider;
