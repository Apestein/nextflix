/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
"use client"

import type z from "zod"
import type { ZactAction } from "./server"
import { useMemo, useRef, useState, useEffect } from "react"

export function useZact<
  InputType extends z.ZodTypeAny,
  ResponseType extends any,
>(
  action: ZactAction<InputType, ResponseType> | null,
  query?: z.infer<InputType>,
) {
  const queryRef = useRef(query)

  const [data, setData] = useState<ResponseType | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [isRunning, setRunning] = useState(false)
  const [err, setErr] = useState<Error | null>(null)

  const execute = useMemo(
    () => async (input: z.infer<InputType>) => {
      if (!action) {
        setData(null)
        return
      }
      setRunning(true)
      try {
        const result = await action(input)
        setData(result)
        setRunning(false)
      } catch (e) {
        console.log(e)
        setErr(e as Error)
        setRunning(false)
      }
    },
    [action],
  )

  useEffect(() => {
    if (!action) {
      setData(null)
      return
    }
    const doQuery = async () => {
      setLoading(true)
      try {
        const result = await action(queryRef.current)
        setData(result)
        setLoading(false)
      } catch (e) {
        console.log(e)
        setErr(e as Error)
        setLoading(false)
      }
    }
    if (queryRef.current) void doQuery()
  }, [action])

  return {
    execute,
    data,
    isLoading,
    isRunning,
    error: err,
  }
}
