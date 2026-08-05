import { ActionState } from "@/types"

type HandleActionResultOptions = {
  onSuccess?: () => void | Promise<void>
  onError?: (message: string) => void | Promise<void>
  successMessage?: string
  errorMessage?: string
}

export async function handleActionResult(
  result: ActionState | null | undefined,
  {
    onSuccess,
    onError,
    successMessage,
    errorMessage = "Something went wrong",
  }: HandleActionResultOptions = {}
) {
  if (!result?.success) {
    const message = result?.message ?? errorMessage
    onError?.(message)
    return { success: false as const, message }
  }

  const message = result.message ?? successMessage ?? "Success"
  await onSuccess?.()

  return { success: true as const, message }
}
