import { LoginFormFieldsType, SignUpFormFieldsType } from "./types";
import * as z from "zod";
import { Container, Layers, LayoutDashboard, NotebookPen } from "lucide-react";

export const signUpFormFields: SignUpFormFieldsType = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "enter your name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
  },
];

export const loginFormFields: LoginFormFieldsType = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
];

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, { error: "Name is required" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .trim()
      .min(8, { error: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { error: "Password must be at least 8 characters long" }),
});

export const navMenu = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Ponds",
    href: "/ponds",
    icon: Layers,
  },
  {
    name: "Daily Logs",
    href: "/daily-logs",
    icon: NotebookPen,
  },
  {
    name: "Harvests",
    href: "/harvests",
    icon: Container,
  },
];
