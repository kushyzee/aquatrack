'use client'

import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { loginFormFields } from "@/lib/constants"

const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string().trim().min(8, { error: "Password must be at least 8 characters long" })
})

export default function LoginForm() {
  const form = useForm({
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value, formApi }) => {
      console.log(value)
      formApi.reset()
    },

  })

  return (
    <form id="login" onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }} className="space-y-5">
      {loginFormFields.map(fieldItem => (
        <form.Field key={fieldItem.name}
          name={fieldItem.name}
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{fieldItem.label}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={fieldItem.type}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={fieldItem?.placeholder}
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </FieldContent>
              </Field>
            )
          }}
        />
      ))}

    </form>
  )
}
