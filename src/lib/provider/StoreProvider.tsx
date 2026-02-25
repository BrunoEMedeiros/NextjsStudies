"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/src/lib/store"; // Adjust path
import { injectStore } from "@/src/lib/api-client"; // Import the injector

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    injectStore(storeRef.current);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
