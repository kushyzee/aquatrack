export type SignUpFormFieldNamesType =
  | "name"
  | "email"
  | "password"
  | "confirmPassword";
export type LoginFormFieldNamesType = "email" | "password";
type AuthFormFieldsType = {
  label: "Name" | "Email" | "Password" | "Confirm Password";
  type: "email" | "text" | "password";
  placeholder?: string;
};
export type SignUpFormFieldsType = (AuthFormFieldsType & {
  name: SignUpFormFieldNamesType;
})[];
export type LoginFormFieldsType = (AuthFormFieldsType & {
  name: LoginFormFieldNamesType;
})[];

export interface LoginFormDataType {
  email: string;
  password: string;
}

export interface SignUpFormDataType extends LoginFormDataType {
  name: string;
  confirmPassword: string;
}

export interface AuthPageWrapperProps {
  title: string;
  description: string;
  buttonText: "Create Account" | "Sign in";
  footerText: "Already" | "Don't";
  linkText: "Log in" | "Create one";
  href: "/login" | "/signup";
  formId: "signup" | "login";
  submitting: boolean;
  children: React.ReactNode;
}

export interface PondCardProps {
  id: string;
  name: string;
  status: "active" | "inactive";
  species: string | null;
  type: string;
  isPondDetailsPage?: boolean;
  children?: React.ReactNode;
}

export interface NewPondFormDataType {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  placeholder?: string;
  isRequired?: boolean;
}
