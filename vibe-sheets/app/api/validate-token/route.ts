import { isUserSignedIn } from "@/lib/auth/auth-verification"

export async function POST(request: Request) {
  if (!isUserSignedIn()) {
    return new Response("Unauthorized", { status: 401 })
  }
  return new Response("Authorized", { status: 200 })
}
