"use client"

import { useState, useCallback } from "react"

export function useLoading(initialState = false) {
  const [loadingStates, setLoadingStates] = useState({
    default: initialState,
  })

  const isLoading = useCallback(
    (key = "default") => {
      return loadingStates[key] || false
    },
    [loadingStates],
  )

  const setLoading = useCallback((loading, key = "default") => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }))
  }, [])

  const withLoading = useCallback(
    (fn, key = "default") => {
      return async (...args) => {
        setLoading(true, key)
        try {
          const result = await fn(...args)
          return result
        } finally {
          setLoading(false, key)
        }
      }
    },
    [setLoading],
  )

  return {
    isLoading,
    setLoading,
    withLoading,
    loadingStates,
  }
}
