import { verifySession } from "@/lib/dal";
import Home from "./home";

export default async function HomePage() {
  const session = await verifySession();

  return <Home session={session} />;
}
