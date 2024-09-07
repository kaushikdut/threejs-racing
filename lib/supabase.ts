import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ckfjbqausccedeedawnw.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getScores(): Promise<{ score: number }[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false });

  if (error) {
    console.error("Error fetching scores:", error);
    throw error;
  }

  return data;
}

export async function saveScore(score: number) {
  const { data, error } = await supabase.from("scores").insert([{ score }]);

  if (error) {
    console.error("Error saving score:", error);
  } else {
    console.log("Score saved successfully:", data);
  }
}
