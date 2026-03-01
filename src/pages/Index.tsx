import { useState } from "react";
import { type DbAlert } from "@/hooks/useAlerts";
import Header from "@/components/dashboard/Header";
import StatsBar from "@/components/dashboard/StatsBar";
import CrimeMap from "@/components/dashboard/CrimeMap";
import AlertList from "@/components/dashboard/AlertList";
import AlertDetail from "@/components/dashboard/AlertDetail";
import RecordsTable from "@/components/dashboard/RecordsTable";
import AIChatPopup from "@/components/dashboard/AIChatPopup";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

type View = "overview" | "records" | "alerts";

const Index = () => {
  const [selectedAlert, setSelectedAlert] = useState<DbAlert | null>(null);
  const [activeView, setActiveView] = useState<View>("overview");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />
        <main className="flex-1 p-3 md:p-5 overflow-auto">
          {activeView === "overview" && (
            <div className="space-y-4 md:space-y-5 animate-fade-in">
              <StatsBar />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
                <div className="lg:col-span-2 h-[350px] md:h-[450px] lg:h-[500px]">
                  <CrimeMap selectedAlert={selectedAlert} onSelectAlert={(alert) => {
                    setSelectedAlert(alert);
                    setActiveView("alerts");
                  }} />
                </div>
                <div className="h-[350px] md:h-[450px] lg:h-[500px]">
                  <AlertList onSelectAlert={(alert) => {
                    setSelectedAlert(alert);
                    setActiveView("alerts");
                  }} selectedAlert={selectedAlert} />
                </div>
              </div>
            </div>
          )}

          {activeView === "records" && (
            <div className="space-y-4 md:space-y-5 animate-fade-in h-full">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Communication Records</h2>
                <p className="text-sm text-muted-foreground mt-1">Monitored phone calls and SMS messages</p>
              </div>
              <div className="h-[calc(100%-60px)]">
                <RecordsTable />
              </div>
            </div>
          )}

          {activeView === "alerts" && (
            <div className="space-y-4 md:space-y-5 animate-fade-in">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Alert Intelligence</h2>
                <p className="text-sm text-muted-foreground mt-1">Active crime alerts and threat details</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
                <div className="lg:col-span-2 h-[400px] md:h-[550px]">
                  <AlertList onSelectAlert={setSelectedAlert} selectedAlert={selectedAlert} />
                </div>
                <div className="lg:col-span-3 h-[400px] md:h-[550px]">
                  <AlertDetail alert={selectedAlert} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <MobileNav activeView={activeView} onChangeView={setActiveView} />
      <AIChatPopup />
    </div>
  );
};

export default Index;
