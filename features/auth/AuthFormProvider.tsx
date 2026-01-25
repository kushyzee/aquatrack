'use client'

import { AnyFormApi } from "@tanstack/react-form"
import { createContext, useContext } from "react"

const FormCtx = createContext<AnyFormApi | null>(null)

interface AuthFormProviderProps {
  form: AnyFormApi
  children: React.ReactNode
}

export default function AuthFormProvider({ form, children }: AuthFormProviderProps) {
  return (
    <FormCtx value={form}>
      {children}
    </FormCtx>
  )
}

export function useAuthForm() {
  const ctx = useContext(FormCtx)

  if (!ctx) {
    throw new Error("useAuthForm must be used within a AuthFormProvider")
  }
  return ctx
}