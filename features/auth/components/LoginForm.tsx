import { useForm } from "@tanstack/react-form"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginFormFields, loginSchema } from "@/lib/constants"
import { loginAction } from "../actions"
import { Dispatch, SetStateAction, useState } from "react"

interface LoginFormProps {
  setSubmitting: Dispatch<SetStateAction<boolean>>
}

export default function LoginForm({ setSubmitting }: LoginFormProps) {
  const [error, setError] = useState<string | undefined>("")

  const form = useForm({
    validators: {
      onChange: loginSchema,
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitting(true)

      const result = await loginAction(value)

      if (!result?.success) {
        // TODO: provide better ux for error
        console.log(result);
        setError(result?.error)
      }

      setSubmitting(false)
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
          listeners={{
            onChange: () => {
              setError(undefined)
            }
          }}
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
      {error && <p className="text-destructive text-sm">{error}</p>}
    </form>
  )
}
