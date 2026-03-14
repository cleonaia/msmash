"use client";

import { ReactNode } from "react";

// Cart is not yet implemented — thin wrapper to keep the interface consistent
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
