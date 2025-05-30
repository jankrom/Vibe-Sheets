import { auth } from "@clerk/nextjs/server"

export async function isUserSignedIn(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) {
    return false
  }
  return true
}
