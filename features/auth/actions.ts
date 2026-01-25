"use server";

import * as z from "zod";

import { loginSchema, signUpSchema } from "@/lib/constants";
import {
  LoginFormDataType,
  SignUpFormDataType,
  SignUpFormFieldNamesType,
} from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUpAction(data: SignUpFormDataType) {
  const result = signUpSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: z.treeifyError(result.error),
    };
  }

  const { email, password, name } = data;

  const supabase = await createClient();

  const { error, data: user } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      errors: {
        email: error.message,
      },
    };
  }

  console.log(user);
  redirect("/");
}

export async function loginAction(data: LoginFormDataType) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: z.treeifyError(result.error),
    };
  }

  const { email, password } = data;

  const supabase = await createClient();

  const { error, data: user } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      errors: {
        email: error.message,
      },
    };
  }

  console.log(user);
  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
