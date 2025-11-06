"use server";

import { deleteSession, createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function updateSession({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  await createSession({ accessToken, refreshToken });
}
