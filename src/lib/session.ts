import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = JWTPayload & {
  refreshToken: string;
  accessToken: string;
};

export async function encrypt(payload: {
  refreshToken: string;
  accessToken: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
    // eslint-disable-next-line
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

export async function createSession({
  refreshToken,
  accessToken,
}: {
  refreshToken: string;
  accessToken: string;
}): Promise<void> {
  const session = await encrypt({ refreshToken, accessToken });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
