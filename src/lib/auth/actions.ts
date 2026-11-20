"use server";

import { redirect } from "next/navigation";
import { endSession } from "./session";

export async function sair() {
  await endSession();
  redirect("/");
}
