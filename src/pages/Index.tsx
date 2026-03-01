import { useState } from "react";
import { type DbAlert } from "@/hooks/useAlerts";
import Header from "@/components/dashboard/Header";
import StatsBar from "@/components/dashboard/StatsBar";
import CrimeMap from "@/components/dashboard/CrimeMap";
import AlertList from "@/components/dashboard/AlertList";
import AlertDetail from "@/components/dashboard/AlertDetail";
import RecordsTable from "@/components/dashboard/RecordsTable";
import AIChatPanel from "@/components/dashboard/AIChatPanel";

const Index = () => {
  const [selectedAlert, setSelectedAlert] = useState<DbAlert | null>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden scanline">
      <Header />
      <div className="flex-1 p-2 md:p-4 space-y-2 md:space-y-4 overflow-hidden flex flex-col">
        <StatsBar />
        {/* Mobile: stacked layout, Desktop: grid */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-2 md:gap-4 min-h-0 overflow-auto lg:overflow-hidden">
          {/* Alerts List */}
          <div className="lg:col-span-2 min-h-[200px] lg:min-h-0 lg:h-full">
            <AlertList onSelectAlert={setSelectedAlert} selectedAlert={selectedAlert} />
          </div>
          {/* Center: Map + Records */}
          <div className="lg:col-span-7 flex flex-col gap-2 md:gap-4 min-h-0">
            <div className="flex-1 min-h-[250px] md:min-h-[300px]">
              <CrimeMap selectedAlert={selectedAlert} onSelectAlert={setSelectedAlert} />
            </div>
            <div className="min-h-[200px] md:h-[250px]">
              <RecordsTable />
            </div>
          </div>
          {/* Right: Detail + Chat */}
          <div className="lg:col-span-3 flex flex-col gap-2 md:gap-4 min-h-0">
            <div className="flex-1 min-h-[200px] lg:min-h-0">
              <AlertDetail alert={selectedAlert} />
            </div>
            <div className="min-h-[250px] md:h-[300px]">
              <AIChatPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
