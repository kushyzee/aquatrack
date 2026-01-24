type AuthFormFieldsType = {
  label: "Name" | "Email" | "Password" | "Confirm Password"
  type: "email" | "text" | "password"
  placeholder?: string
}

export type SignUpFormFieldsType = (AuthFormFieldsType &
{
  name: "name" | "email" | "password" | "confirmPassword"
})[]

export type LoginFormFieldsType = (AuthFormFieldsType & {
  name: "email" | "password"
})[]