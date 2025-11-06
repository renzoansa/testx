import "server-only";

import { cookies } from "next/headers";
import { decrypt, type SessionPayload } from "./session";

export type VerifySessionResult = { isAuth: boolean } & Partial<SessionPayload>;

export const verifySession = async (): Promise<VerifySessionResult> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  return { isAuth: !!session, ...session };
};
