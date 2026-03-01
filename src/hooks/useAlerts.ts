import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface DbAlert {
  id: string;
  alert_code: string;
  crime_type: string;
  risk_level: string;
  summary: string;
  source: string;
  source_id: string | null;
  phone_number: string;
  lat: number;
  lng: number;
  location_address: string;
  status: string;
  ai_analysis: string | null;
  assigned_station_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useAlerts() {
  const query = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbAlert[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("alerts-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        query.refetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [query.refetch]);

  return query;
}

export function useCallRecords() {
  return useQuery({
    queryKey: ["call_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("call_records")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSmsRecords() {
  return useQuery({
    queryKey: ["sms_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sms_records")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePoliceStations() {
  return useQuery({
    queryKey: ["police_stations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("police_stations")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const [alertsRes, callsRes, smsRes] = await Promise.all([
        supabase.from("alerts").select("status, risk_level"),
        supabase.from("call_records").select("id, status"),
        supabase.from("sms_records").select("id, status"),
      ]);

      const alerts = alertsRes.data || [];
      const calls = callsRes.data || [];
      const sms = smsRes.data || [];

      return {
        activeAlerts: alerts.filter((a) => a.status === "active").length,
        threatsDetected: alerts.length,
        totalCalls: calls.length,
        totalSMS: sms.length,
        resolvedToday: alerts.filter((a) => a.status === "resolved").length,
        officersOnline: 18, // placeholder
      };
    },
  });
}
