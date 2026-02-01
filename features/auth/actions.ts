"use server";

import { loginSchema, signUpSchema } from "@/lib/constants";
import { LoginFormDataType, SignUpFormDataType } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type AuthError } from "@supabase/supabase-js";

const getErrorObject = (errorType: string, error?: AuthError) => {
  const errorObject = {
    success: false,
    error: "",
  };

  if (errorType === "zodValidation") {
    errorObject.error = "Invalid input";
    return errorObject;
  }

  if (errorType === "supabase") {
    errorObject.error = "An error occurred. Please try again.";

    if (error?.message.includes("Invalid login")) {
      errorObject.error = "Invalid login credentials";
    } else if (error?.message.includes("already registered")) {
      errorObject.error = "User already registered";
    }

    return errorObject;
  }
};

export async function signUpAction(data: SignUpFormDataType) {
  const result = signUpSchema.safeParse(data);

  if (!result.success) {
    return getErrorObject("zodValidation");
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
    console.log(error);
    return getErrorObject("supabase", error);
  }

  console.log(user);
  redirect("/");
}

export async function loginAction(data: LoginFormDataType) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return getErrorObject("zodValidation");
  }

  const { email, password } = data;

  const supabase = await createClient();

  const { error, data: user } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);

    return getErrorObject("supabase", error);
  }

  console.log(user);
  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
