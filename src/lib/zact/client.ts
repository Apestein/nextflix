/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
"use client"

import type z from "zod"
import type { ZactAction } from "./server"
import { useMemo, useRef, useState, useEffect } from "react"

export function useZact<
  InputType extends z.ZodTypeAny,
  ResponseType extends any,
>(action: ZactAction<InputType, ResponseType>, query?: z.infer<InputType>) {
  const doAction = useRef(action)

  const [data, setData] = useState<ResponseType | null>(null)

  const [isRunning, setRunning] = useState(false)
  const [err, setErr] = useState<Error | null>(null)

  const execute = useMemo(
    () => async (input: z.infer<InputType>) => {
      setRunning(true)
      setErr(null)
      setData(null)
      try {
        const result = await doAction.current(input)
        setData(result)
        setRunning(false)
      } catch (e) {
        console.log(e)
        setErr(e as Error)
        setRunning(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (query) void execute(query)
  }, [])

  return {
    execute,
    data,
    isRunning,
    error: err,
  }
}
