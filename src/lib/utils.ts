import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Database } from "./../../database.types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { createClient, AuthClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.PUBLIC_URL;
const supabaseKey = process.env.PRIVATE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: true },
});

export { supabase };
