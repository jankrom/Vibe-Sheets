import { sendTokenToAppScript } from "@/lib/auth/app-script-token"

const SignedInPage = async ({
  params,
}: {
  params: Promise<{ spreadsheetId: string }>
}) => {
  const { spreadsheetId } = await params
  const result = await sendTokenToAppScript(spreadsheetId)
  if (result.startsWith("Error")) {
    return <div>{result}</div>
  }
  return <div>You have successfully signed in! You can close this tab now.</div>
}
export default SignedInPage
