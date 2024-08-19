"use server";

import { redirect } from "next/navigation";

export async function search(category, dateRange, guests) {
  console.log({ category, dateRange, guests });

  redirect("/search");
}
