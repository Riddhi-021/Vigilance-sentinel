import { useState } from "react";
import { type Alert } from "@/data/mockData";
import Header from "@/components/dashboard/Header";
import StatsBar from "@/components/dashboard/StatsBar";
import CrimeMap from "@/components/dashboard/CrimeMap";
import AlertList from "@/components/dashboard/AlertList";
import AlertDetail from "@/components/dashboard/AlertDetail";
import RecordsTable from "@/components/dashboard/RecordsTable";
import AIChatPanel from "@/components/dashboard/AIChatPanel";

const Index = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden scanline">
      <Header />
      <div className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col">
        <StatsBar />
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          {/* Left: Alerts */}
          <div className="lg:col-span-2 min-h-0">
            <AlertList onSelectAlert={setSelectedAlert} selectedAlert={selectedAlert} />
          </div>
          {/* Center: Map + Records */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-[300px]">
              <CrimeMap selectedAlert={selectedAlert} onSelectAlert={setSelectedAlert} />
            </div>
            <div className="h-[250px]">
              <RecordsTable />
            </div>
          </div>
          {/* Right: Detail + Chat */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <AlertDetail alert={selectedAlert} />
            </div>
            <div className="h-[300px]">
              <AIChatPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
