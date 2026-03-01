import { useState } from "react";
import { type DbAlert } from "@/hooks/useAlerts";
import Header from "@/components/dashboard/Header";
import StatsBar from "@/components/dashboard/StatsBar";
import CrimeMap from "@/components/dashboard/CrimeMap";
import AlertList from "@/components/dashboard/AlertList";
import AlertDetail from "@/components/dashboard/AlertDetail";
import RecordsTable from "@/components/dashboard/RecordsTable";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ThreatChart from "@/components/dashboard/ThreatChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, BarChart3, MessageSquare } from "lucide-react";

const Index = () => {
  const [selectedAlert, setSelectedAlert] = useState<DbAlert | null>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden scanline">
      <Header />
      <div className="flex-1 p-2 md:p-4 space-y-2 md:space-y-4 overflow-hidden flex flex-col">
        <StatsBar />

        {/* Mobile: tabbed layout */}
        <div className="flex-1 min-h-0 lg:hidden">
          <Tabs defaultValue="map" className="h-full flex flex-col">
            <TabsList className="bg-secondary/50 h-9 w-full grid grid-cols-4">
              <TabsTrigger value="map" className="text-xs gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Map className="w-3 h-3" /> Map
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <List className="w-3 h-3" /> Alerts
              </TabsTrigger>
              <TabsTrigger value="records" className="text-xs gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <BarChart3 className="w-3 h-3" /> Data
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <MessageSquare className="w-3 h-3" /> AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="flex-1 mt-2">
              <CrimeMap selectedAlert={selectedAlert} onSelectAlert={setSelectedAlert} />
            </TabsContent>
            <TabsContent value="alerts" className="flex-1 mt-2 flex flex-col gap-2 overflow-hidden">
              <div className="flex-1 min-h-0">
                <AlertList onSelectAlert={setSelectedAlert} selectedAlert={selectedAlert} />
              </div>
              {selectedAlert && (
                <div className="h-[250px]">
                  <AlertDetail alert={selectedAlert} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="records" className="flex-1 mt-2 flex flex-col gap-2 overflow-hidden">
              <div className="h-[180px]">
                <ThreatChart />
              </div>
              <div className="flex-1 min-h-0">
                <RecordsTable />
              </div>
            </TabsContent>
            <TabsContent value="chat" className="flex-1 mt-2">
              <AIChatPanel />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: grid layout */}
        <div className="flex-1 hidden lg:grid grid-cols-12 gap-4 min-h-0">
          <div className="col-span-2 min-h-0">
            <AlertList onSelectAlert={setSelectedAlert} selectedAlert={selectedAlert} />
          </div>
          <div className="col-span-7 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-[300px]">
              <CrimeMap selectedAlert={selectedAlert} onSelectAlert={setSelectedAlert} />
            </div>
            <div className="h-[250px]">
              <RecordsTable />
            </div>
          </div>
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <AlertDetail alert={selectedAlert} />
            </div>
            <div className="h-[160px]">
              <ThreatChart />
            </div>
            <div className="h-[280px]">
              <AIChatPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
