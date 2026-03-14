"use client";

import { ReactNode } from "react";

// Auth is not yet implemented — thin wrapper to keep the interface consistent
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
