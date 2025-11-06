import { verifySession } from "@/lib/dal";
import Profile from "./profile";

export default async function ProfilePage() {
  const session = await verifySession();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const userData = response.ok ? await response.json() : null;

  return <Profile session={session} me={userData} />;
}
