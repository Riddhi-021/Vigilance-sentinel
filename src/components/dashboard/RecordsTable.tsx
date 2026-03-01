import { useCallRecords, useSmsRecords } from "@/hooks/useAlerts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const riskBadge = (level: string | null) => {
  if (!level) return <span className="text-[10px] text-muted-foreground font-mono">CLEAN</span>;
  const cls: Record<string, string> = {
    critical: "bg-risk-critical/20 text-risk-critical border-risk-critical/40",
    high: "bg-risk-high/20 text-risk-high border-risk-high/40",
    medium: "bg-risk-medium/20 text-risk-medium border-risk-medium/40",
    low: "bg-risk-low/20 text-risk-low border-risk-low/40",
  };
  return <Badge className={`text-[10px] px-1.5 py-0 border ${cls[level] || ""}`}>{level.toUpperCase()}</Badge>;
};

const RecordsTable = () => {
  const { data: calls, isLoading: callsLoading } = useCallRecords();
  const { data: smsRecords, isLoading: smsLoading } = useSmsRecords();

  return (
    <div className="glass-panel rounded-lg h-full flex flex-col">
      <Tabs defaultValue="calls" className="flex flex-col h-full">
        <div className="border-b border-border px-4 pt-3">
          <TabsList className="bg-secondary/50 h-8">
            <TabsTrigger value="calls" className="text-xs gap-1.5 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Phone className="w-3 h-3" /> Calls ({calls?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="sms" className="text-xs gap-1.5 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <MessageSquare className="w-3 h-3" /> SMS ({smsRecords?.length || 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calls" className="flex-1 m-0">
          {callsLoading ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : (
            <ScrollArea className="h-full">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px]">Phone</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] hidden sm:table-cell">Duration</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px]">Status</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] hidden lg:table-cell">Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {calls?.map((call) => (
                    <tr key={call.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-3 font-mono">{call.phone_number}</td>
                      <td className="p-3 font-mono hidden sm:table-cell">{call.duration || "—"}</td>
                      <td className="p-3">{riskBadge(call.status === "flagged" ? "high" : null)}</td>
                      <td className="p-3 max-w-[200px] truncate text-muted-foreground hidden lg:table-cell">{call.transcript || "—"}</td>
                    </tr>
                  ))}
                  {(!calls || calls.length === 0) && (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No call records</td></tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="sms" className="flex-1 m-0">
          {smsLoading ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : (
            <ScrollArea className="h-full">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px]">Phone</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px]">Status</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px]">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {smsRecords?.map((sms) => (
                    <tr key={sms.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-3 font-mono">{sms.phone_number}</td>
                      <td className="p-3">{riskBadge(sms.status === "flagged" ? "high" : null)}</td>
                      <td className="p-3 max-w-[300px] truncate text-muted-foreground">{sms.message}</td>
                    </tr>
                  ))}
                  {(!smsRecords || smsRecords.length === 0) && (
                    <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">No SMS records</td></tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordsTable;
