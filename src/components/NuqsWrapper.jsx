"use client";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function NuqsWrapper({ children }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
