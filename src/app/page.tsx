import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Root() {
  const cookieStore = await cookies();

  const isLoged = cookieStore.get("isLoged")?.value === "true";

  if (isLoged) {
    redirect("/dashboard/activities");
  }
  redirect("/signin");
}
