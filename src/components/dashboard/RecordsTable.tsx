import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageSquare, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useCallRecords, useSmsRecords } from "@/hooks/useAlerts";
import { useState } from "react";

const riskBadge = (status: string) => {
  if (status === "pending") return <span className="text-[10px] text-muted-foreground font-mono">PENDING</span>;
  if (status === "analyzed") return <span className="text-[10px] text-risk-low font-mono">CLEAN</span>;
  const cls = "bg-risk-high/20 text-risk-high border-risk-high/40";
  return <Badge className={`text-[10px] px-1.5 py-0 border ${cls}`}>FLAGGED</Badge>;
};

const RecordsTable = () => {
  const { records: calls, loading: callsLoading } = useCallRecords();
  const { records: sms, loading: smsLoading } = useSmsRecords();
  const [search, setSearch] = useState("");

  const filteredCalls = calls.filter(c =>
    !search || c.phone_number?.toLowerCase().includes(search.toLowerCase()) ||
    c.transcript?.toLowerCase().includes(search.toLowerCase()) ||
    c.caller_name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSms = sms.filter(s =>
    !search || s.phone_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.message?.toLowerCase().includes(search.toLowerCase()) ||
    s.sender_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-lg h-full flex flex-col">
      <Tabs defaultValue="calls" className="flex flex-col h-full">
        <div className="border-b border-border px-3 md:px-4 pt-3 flex flex-col sm:flex-row sm:items-center gap-2">
          <TabsList className="bg-secondary/50 h-8">
            <TabsTrigger value="calls" className="text-xs gap-1.5 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Phone className="w-3 h-3" /> Calls ({calls.length})
            </TabsTrigger>
            <TabsTrigger value="sms" className="text-xs gap-1.5 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <MessageSquare className="w-3 h-3" /> SMS ({sms.length})
            </TabsTrigger>
          </TabsList>
          <div className="relative sm:ml-auto mb-2 sm:mb-0">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..."
              className="h-7 text-xs pl-7 w-full sm:w-48 bg-secondary/50 border-border" />
          </div>
        </div>

        <TabsContent value="calls" className="flex-1 m-0">
          <ScrollArea className="h-full">
            {callsLoading ? (
              <div className="p-4 text-center text-muted-foreground text-xs">Loading...</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px]">Phone</th>
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px] hidden sm:table-cell">Caller</th>
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px]">Duration</th>
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px]">Status</th>
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px] hidden lg:table-cell">Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCalls.map((call: any) => (
                    <tr key={call.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-2 md:p-3 font-mono">{call.phone_number}</td>
                      <td className="p-2 md:p-3 hidden sm:table-cell">{call.caller_name || "Unknown"}</td>
                      <td className="p-2 md:p-3 font-mono">{call.duration}</td>
                      <td className="p-2 md:p-3">{riskBadge(call.status)}</td>
                      <td className="p-2 md:p-3 max-w-[200px] truncate text-muted-foreground hidden lg:table-cell">{call.transcript}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sms" className="flex-1 m-0">
          <ScrollArea className="h-full">
            {smsLoading ? (
              <div className="p-4 text-center text-muted-foreground text-xs">Loading...</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px]">Phone</th>
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px] hidden sm:table-cell">Sender</th>
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px]">Status</th>
                    <th className="text-left p-2 md:p-3 font-medium uppercase tracking-wider text-[10px]">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSms.map((sms: any) => (
                    <tr key={sms.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-2 md:p-3 font-mono">{sms.phone_number}</td>
                      <td className="p-2 md:p-3 hidden sm:table-cell">{sms.sender_name || "Unknown"}</td>
                      <td className="p-2 md:p-3">{riskBadge(sms.status)}</td>
                      <td className="p-2 md:p-3 max-w-[300px] truncate text-muted-foreground">{sms.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordsTable;
