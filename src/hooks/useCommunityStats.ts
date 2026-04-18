import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type CommunityStatsRow = {
  id: number;
  total_water_ml: number | string;
  total_co2_g: number | string;
  unique_users_count: number;
  updated_at: string;
};

export function useCommunityStats() {
  const [stats, setStats] = useState({
    totalWaterMl: 0,
    totalCo2G: 0,
    uniqueUsers: 0,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from("community_stats")
        .select("*")
        .eq("id", 1)
        .single();

      console.log("community_stats initial", { data, error });

      if (error) {
        if (active) {
          setStats((prev) => ({ ...prev, loading: false }));
        }
        return;
      }

      if (data && active) {
        const row = data as CommunityStatsRow;
        setStats({
          totalWaterMl: Number(row.total_water_ml ?? 0),
          totalCo2G: Number(row.total_co2_g ?? 0),
          uniqueUsers: Number(row.unique_users_count ?? 0),
          loading: false,
        });
      }
    }

    load();

    const channel = supabase
      .channel("community-stats")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "community_stats",
        },
        (payload) => {
          console.log("community_stats realtime payload", payload);

          const row = payload.new as CommunityStatsRow;
          setStats({
            totalWaterMl: Number(row.total_water_ml ?? 0),
            totalCo2G: Number(row.total_co2_g ?? 0),
            uniqueUsers: Number(row.unique_users_count ?? 0),
            loading: false,
          });
        }
      )
      .subscribe((status) => {
        console.log("community_stats channel status", status);
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return stats;
}
