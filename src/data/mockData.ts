export type RiskLevel = "critical" | "high" | "medium" | "low";

export interface Alert {
  id: string;
  crimeType: string;
  riskLevel: RiskLevel;
  summary: string;
  source: "call" | "sms";
  sourceId: string;
  phoneNumber: string;
  location: { lat: number; lng: number; address: string };
  nearestStation: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

export interface CallRecord {
  id: string;
  phoneNumber: string;
  duration: string;
  transcript: string;
  crimeDetected: boolean;
  riskLevel: RiskLevel | null;
  crimeType: string | null;
  location: { lat: number; lng: number };
  timestamp: string;
}

export interface SMSRecord {
  id: string;
  phoneNumber: string;
  message: string;
  crimeDetected: boolean;
  riskLevel: RiskLevel | null;
  crimeType: string | null;
  location: { lat: number; lng: number };
  timestamp: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  officers: number;
}

export const policeStations: PoliceStation[] = [
  { id: "ps1", name: "Central Crime Branch", location: { lat: 28.6139, lng: 77.209 }, address: "Connaught Place, New Delhi", officers: 45 },
  { id: "ps2", name: "South District HQ", location: { lat: 28.5494, lng: 77.2001 }, address: "Saket, New Delhi", officers: 32 },
  { id: "ps3", name: "East District Station", location: { lat: 28.6280, lng: 77.2780 }, address: "Preet Vihar, New Delhi", officers: 28 },
  { id: "ps4", name: "North Crime Unit", location: { lat: 28.6862, lng: 77.2217 }, address: "Civil Lines, New Delhi", officers: 35 },
  { id: "ps5", name: "West Zone Command", location: { lat: 28.6517, lng: 77.1185 }, address: "Janakpuri, New Delhi", officers: 30 },
];

export const alerts: Alert[] = [
  {
    id: "ALT-001", crimeType: "Drug Trafficking", riskLevel: "critical",
    summary: "Suspect discussing large-scale drug delivery at Paharganj area. Multiple references to 'product' and 'shipment'.",
    source: "call", sourceId: "CALL-001", phoneNumber: "+91-98765-43210",
    location: { lat: 28.6448, lng: 77.2167, address: "Paharganj, New Delhi" },
    nearestStation: "Central Crime Branch", timestamp: "2026-03-01T08:15:00Z", status: "active",
  },
  {
    id: "ALT-002", crimeType: "Extortion", riskLevel: "high",
    summary: "Threatening messages demanding ₹5L protection money from shop owner in Karol Bagh market.",
    source: "sms", sourceId: "SMS-001", phoneNumber: "+91-87654-32109",
    location: { lat: 28.6519, lng: 77.1905, address: "Karol Bagh, New Delhi" },
    nearestStation: "Central Crime Branch", timestamp: "2026-03-01T07:42:00Z", status: "active",
  },
  {
    id: "ALT-003", crimeType: "Kidnapping Threat", riskLevel: "high",
    summary: "Call intercept reveals planned abduction of businessman. Location and time mentioned.",
    source: "call", sourceId: "CALL-003", phoneNumber: "+91-99887-65432",
    location: { lat: 28.5672, lng: 77.2100, address: "Green Park, New Delhi" },
    nearestStation: "South District HQ", timestamp: "2026-03-01T06:30:00Z", status: "acknowledged",
  },
  {
    id: "ALT-004", crimeType: "Illegal Arms", riskLevel: "medium",
    summary: "SMS references to weapons deal. Mentions 'hardware' delivery near Yamuna bank.",
    source: "sms", sourceId: "SMS-003", phoneNumber: "+91-77665-54433",
    location: { lat: 28.6230, lng: 77.2900, address: "Yamuna Bank, New Delhi" },
    nearestStation: "East District Station", timestamp: "2026-03-01T05:15:00Z", status: "active",
  },
  {
    id: "ALT-005", crimeType: "Fraud", riskLevel: "low",
    summary: "Suspected phone scam targeting elderly. Caller impersonating bank official.",
    source: "call", sourceId: "CALL-005", phoneNumber: "+91-66554-43322",
    location: { lat: 28.6900, lng: 77.2300, address: "Model Town, New Delhi" },
    nearestStation: "North Crime Unit", timestamp: "2026-03-01T04:00:00Z", status: "resolved",
  },
];

export const callRecords: CallRecord[] = [
  { id: "CALL-001", phoneNumber: "+91-98765-43210", duration: "4:32", transcript: "Listen, the product arrives tonight at Paharganj. Bring the cash. We'll split the shipment into three. Don't come alone, bring the boys.", crimeDetected: true, riskLevel: "critical", crimeType: "Drug Trafficking", location: { lat: 28.6448, lng: 77.2167 }, timestamp: "2026-03-01T08:15:00Z" },
  { id: "CALL-002", phoneNumber: "+91-91234-56789", duration: "2:15", transcript: "Hey, just checking about the birthday party arrangements. Can you bring the cake?", crimeDetected: false, riskLevel: null, crimeType: null, location: { lat: 28.6139, lng: 77.209 }, timestamp: "2026-03-01T07:50:00Z" },
  { id: "CALL-003", phoneNumber: "+91-99887-65432", duration: "6:10", transcript: "The businessman leaves his office at 7 PM sharp. We grab him near Green Park metro. The van will be ready. Make sure nobody sees.", crimeDetected: true, riskLevel: "high", crimeType: "Kidnapping", location: { lat: 28.5672, lng: 77.21 }, timestamp: "2026-03-01T06:30:00Z" },
  { id: "CALL-004", phoneNumber: "+91-88776-65544", duration: "1:45", transcript: "Can you pick up groceries on the way home? We need milk and bread.", crimeDetected: false, riskLevel: null, crimeType: null, location: { lat: 28.635, lng: 77.225 }, timestamp: "2026-03-01T05:00:00Z" },
  { id: "CALL-005", phoneNumber: "+91-66554-43322", duration: "8:20", transcript: "Sir, this is calling from your bank. Your account has been compromised. Please share your OTP immediately to secure your funds.", crimeDetected: true, riskLevel: "low", crimeType: "Fraud", location: { lat: 28.69, lng: 77.23 }, timestamp: "2026-03-01T04:00:00Z" },
];

export const smsRecords: SMSRecord[] = [
  { id: "SMS-001", phoneNumber: "+91-87654-32109", message: "Pay ₹5 lakh by Friday or your shop burns. This is your last warning. Don't go to police.", crimeDetected: true, riskLevel: "high", crimeType: "Extortion", location: { lat: 28.6519, lng: 77.1905 }, timestamp: "2026-03-01T07:42:00Z" },
  { id: "SMS-002", phoneNumber: "+91-92345-67890", message: "Meeting rescheduled to 3 PM tomorrow. Please confirm.", crimeDetected: false, riskLevel: null, crimeType: null, location: { lat: 28.62, lng: 77.215 }, timestamp: "2026-03-01T07:00:00Z" },
  { id: "SMS-003", phoneNumber: "+91-77665-54433", message: "Hardware ready for pickup near Yamuna bank bridge. Come after dark. Bring full amount.", crimeDetected: true, riskLevel: "medium", crimeType: "Illegal Arms", location: { lat: 28.623, lng: 77.29 }, timestamp: "2026-03-01T05:15:00Z" },
  { id: "SMS-004", phoneNumber: "+91-81234-00099", message: "Happy anniversary! Wishing you both a wonderful day.", crimeDetected: false, riskLevel: null, crimeType: null, location: { lat: 28.64, lng: 77.22 }, timestamp: "2026-03-01T04:30:00Z" },
  { id: "SMS-005", phoneNumber: "+91-70011-22334", message: "Transfer the black money to the new account before audit. Delete all records.", crimeDetected: true, riskLevel: "high", crimeType: "Money Laundering", location: { lat: 28.655, lng: 77.235 }, timestamp: "2026-03-01T03:00:00Z" },
];

export const stats = {
  totalCalls: 1247,
  totalSMS: 3891,
  activeAlerts: 3,
  threatsDetected: 42,
  callsToday: 87,
  smsToday: 234,
  resolvedToday: 12,
  officersOnline: 18,
};
