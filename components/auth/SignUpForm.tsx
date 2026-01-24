'use client'

import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { signUpFormFields } from "@/lib/constants"

const signUpSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required" }),
  email: z.email({ error: "Invalid email address" }),
  password: z.string().trim().min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export default function SignUpForm() {
  const form = useForm({
    validators: {
      onChange: signUpSchema,
      onSubmit: signUpSchema
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({ value, formApi }) => {
      console.log(value)
      formApi.reset()
    },
  })

  

  return (
    <form id="signup" onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }} className="space-y-5">
      {signUpFormFields.map(fieldItem => (
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
