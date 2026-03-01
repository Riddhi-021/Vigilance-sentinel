import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { alerts, policeStations, type Alert } from "@/data/mockData";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const riskColorHex: Record<string, string> = {
  critical: "#b91c1c",
  high: "#dc2626",
  medium: "#d97706",
  low: "#16a34a",
};

const stationIcon = new L.DivIcon({
  html: `<div style="background:#0ea5e9;width:12px;height:12px;border-radius:50%;border:2px solid #0c4a6e;box-shadow:0 0 8px rgba(14,165,233,0.5)"></div>`,
  className: "",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function FlyToAlert({ alert }: { alert: Alert | null }) {
  const map = useMap();
  useEffect(() => {
    if (alert) {
      map.flyTo([alert.location.lat, alert.location.lng], 14, { duration: 0.8 });
    }
  }, [alert, map]);
  return null;
}

interface CrimeMapProps {
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
}

const CrimeMap = ({ selectedAlert, onSelectAlert }: CrimeMapProps) => (
  <div className="glass-panel rounded-lg overflow-hidden h-full relative">
    <div className="absolute top-3 left-3 z-[1000] glass-panel rounded-md px-3 py-1.5">
      <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Live Threat Map</p>
    </div>
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToAlert alert={selectedAlert} />

      {alerts.filter(a => a.status !== "resolved").map(alert => (
        <CircleMarker
          key={alert.id}
          center={[alert.location.lat, alert.location.lng]}
          radius={selectedAlert?.id === alert.id ? 14 : 10}
          pathOptions={{
            color: riskColorHex[alert.riskLevel],
            fillColor: riskColorHex[alert.riskLevel],
            fillOpacity: 0.4,
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelectAlert(alert) }}
        >
          <Popup>
            <div className="text-xs">
              <p className="font-bold">{alert.crimeType}</p>
              <p>{alert.location.address}</p>
              <p className="uppercase font-mono">{alert.riskLevel} risk</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {policeStations.map(station => (
        <Marker key={station.id} position={[station.location.lat, station.location.lng]} icon={stationIcon}>
          <Popup>
            <div className="text-xs">
              <p className="font-bold">{station.name}</p>
              <p>{station.address}</p>
              <p>{station.officers} officers</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

export default CrimeMap;
