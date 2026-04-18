import { supabase } from "./supabase";
import { getOrCreateAnonymousUserId } from "./getOrCreateAnonymousUserId";

type TrackFootprintEventInput = {
  waterMl: number;
  co2G: number;
};

export async function trackFootprintEvent({
  waterMl,
  co2G,
}: TrackFootprintEventInput) {
  const userId = getOrCreateAnonymousUserId();

  const { data, error } = await supabase.from("footprint_events").insert({
    user_id: userId,
    water_ml: waterMl,
    co2_g: co2G,
  });

  console.log("insert result", { data, error, userId, waterMl, co2G });

  if (error) {
    console.error("Failed to insert footprint event:", error);
    throw error;
  }
}
