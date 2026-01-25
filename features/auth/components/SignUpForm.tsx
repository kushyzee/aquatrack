'use client'

import { useForm } from "@tanstack/react-form"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUpFormFields, signUpSchema } from "@/lib/constants"
import { signUpAction } from "../actions"

export default function SignUpForm() {
  const form = useForm({
    validators: {
      onChange: signUpSchema,
      // onSubmit: signUpSchema,
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await signUpAction(value)

      if (!result.success) {
        console.log("there is an error with the form");
        // TODO: provide better ux for error
      }

      console.log(value)
      formApi.reset()
    },
  })


  return (
    <form id="signup" onSubmit={(e) => {
      e.preventDefault()
      void form.handleSubmit()
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
