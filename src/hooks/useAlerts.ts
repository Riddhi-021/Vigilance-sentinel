import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbAlert {
  id: string;
  alert_code: string;
  crime_type: string;
  risk_level: string;
  summary: string;
  ai_analysis: string | null;
  source: string;
  source_id: string | null;
  phone_number: string;
  lat: number;
  lng: number;
  location_address: string;
  assigned_station_id: string | null;
  status: string;
  assigned_officer_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<DbAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setAlerts(data as unknown as DbAlert[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel("alerts-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateAlertStatus = async (id: string, status: string) => {
    await supabase.from("alerts").update({ status } as any).eq("id", id);
  };

  return { alerts, loading, refetch: fetchAlerts, updateAlertStatus };
};

export const useCallRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("call_records")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setRecords(data as any[]);
        setLoading(false);
      });
  }, []);

  return { records, loading };
};

export const useSmsRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("sms_records")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setRecords(data as any[]);
        setLoading(false);
      });
  }, []);

  return { records, loading };
};

export const usePoliceStations = () => {
  const [stations, setStations] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("police_stations")
      .select("*")
      .then(({ data }) => {
        if (data) setStations(data as any[]);
      });
  }, []);

  return { stations };
};
