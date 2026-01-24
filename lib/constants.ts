import { LoginFormFieldsType, SignUpFormFieldsType } from "./types";

export const signUpFormFields: SignUpFormFieldsType = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'enter your name'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'enter your email'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
  },
]

export const loginFormFields: LoginFormFieldsType = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'enter your email'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
  },
]