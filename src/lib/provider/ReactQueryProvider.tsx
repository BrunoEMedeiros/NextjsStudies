"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            // A session-expiry redirect thrown by a server action looks like
            // any other query error to React Query — don't retry it, or the
            // redirect to /signin gets delayed by the retry backoff.
            retry: (failureCount, error) =>
              !isRedirectError(error) && failureCount < 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
