import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageSquare, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useCallRecords, useSmsRecords } from "@/hooks/useAlerts";
import { useState } from "react";

const riskBadge = (status: string) => {
  if (status === "pending") return <Badge variant="outline" className="text-[10px] font-mono">PENDING</Badge>;
  if (status === "analyzed") return <Badge className="text-[10px] bg-risk-low/20 text-risk-low border-risk-low/40 border font-mono">CLEAN</Badge>;
  return <Badge className="text-[10px] bg-risk-high/20 text-risk-high border-risk-high/40 border font-mono">FLAGGED</Badge>;
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
    <div className="glass-panel rounded-xl h-full flex flex-col">
      <Tabs defaultValue="calls" className="flex flex-col h-full">
        <div className="border-b border-border px-4 pt-4 pb-3 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <TabsList className="bg-secondary/50 h-9">
              <TabsTrigger value="calls" className="text-xs gap-2 h-8 px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Phone className="w-3.5 h-3.5" /> Calls ({calls.length})
              </TabsTrigger>
              <TabsTrigger value="sms" className="text-xs gap-2 h-8 px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <MessageSquare className="w-3.5 h-3.5" /> SMS ({sms.length})
              </TabsTrigger>
            </TabsList>
            <div className="relative sm:ml-auto">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..."
                className="h-8 text-xs pl-9 w-full sm:w-56 bg-secondary/50 border-border" />
            </div>
          </div>
        </div>

        <TabsContent value="calls" className="flex-1 m-0">
          <ScrollArea className="h-full">
            {callsLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading call records...</div>
            ) : (
              <div className="divide-y divide-border/30">
                {filteredCalls.map((call: any) => (
                  <div key={call.id} className="px-5 py-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm font-medium">{call.phone_number}</span>
                        <span className="text-xs text-muted-foreground">{call.caller_name || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">{call.duration}</span>
                        {riskBadge(call.status)}
                      </div>
                    </div>
                    {call.transcript && (
                      <p className="text-xs text-muted-foreground leading-relaxed pl-7 line-clamp-2">{call.transcript}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sms" className="flex-1 m-0">
          <ScrollArea className="h-full">
            {smsLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading SMS records...</div>
            ) : (
              <div className="divide-y divide-border/30">
                {filteredSms.map((sms: any) => (
                  <div key={sms.id} className="px-5 py-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm font-medium">{sms.phone_number}</span>
                        <span className="text-xs text-muted-foreground">{sms.sender_name || "Unknown"}</span>
                      </div>
                      {riskBadge(sms.status)}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-7 line-clamp-2">{sms.message}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordsTable;
