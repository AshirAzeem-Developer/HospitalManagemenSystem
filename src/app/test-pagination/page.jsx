"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import PaginationDemo from "./PaginationDemo";

export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading pagination demo...</div>}>
      <PaginationDemo />
    </Suspense>
  );
}
