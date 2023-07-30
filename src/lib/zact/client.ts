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

  const [isRunning, setIsLoading] = useState(false)
  const [err, setErr] = useState<Error | null>(null)

  const mutate = useMemo(
    () => async (input: z.infer<InputType>) => {
      setIsLoading(true)
      setErr(null)
      setData(null)
      try {
        const result = await doAction.current(input)
        setData(result)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
        setErr(e as Error)
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    const executeQuery = async (input: z.infer<InputType>) => {
      setIsLoading(true)
      setErr(null)
      setData(null)
      try {
        const result = await doAction.current(input)
        setData(result)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
        setErr(e as Error)
        setIsLoading(false)
      }
    }
    if (query) void executeQuery(query)
  }, [query])

  return {
    mutate,
    data,
    isRunning,
    error: err,
  }
}
