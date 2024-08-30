import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Database } from "./../../database.types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { createClient, AuthClient } from "@supabase/supabase-js";
console.log(import.meta.env.PUBLIC_URL);

const supabaseUrl = import.meta.env.VITE_PUBLIC_URL;
const supabaseKey = import.meta.env.VITE_PRIVATE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: true },
});

export { supabase };
