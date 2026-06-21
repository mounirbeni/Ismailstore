const RESTAURANT = { lat: 31.6461, lng: -8.0714 };

const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number; group: 'near' | 'far' | 'vfar' }> = {
  // ── NEAR < 5 km road — 15 DH ──────────────────────────────────────────
  'Massira 3':           { lat: 31.636, lng: -8.071, group: 'near' },
  'Massira 2':           { lat: 31.630, lng: -8.071, group: 'near' },
  'Massira 1':           { lat: 31.624, lng: -8.071, group: 'near' },
  'Targa':               { lat: 31.651, lng: -8.042, group: 'near' },
  'Azzouzia':            { lat: 31.617, lng: -8.074, group: 'near' },
  'Route de Casablanca': { lat: 31.667, lng: -8.089, group: 'near' },

  // ── FAR 5–10 km road — 20 DH ──────────────────────────────────────────
  'Sidi Ghanem':         { lat: 31.668, lng: -8.108, group: 'far' },
  'Hay Salam':           { lat: 31.626, lng: -8.038, group: 'far' },
  'Amerchich':           { lat: 31.652, lng: -8.031, group: 'far' },
  'Iziki':               { lat: 31.636, lng: -8.115, group: 'far' },
  'Socoma':              { lat: 31.617, lng: -8.106, group: 'far' },
  'Azli':                { lat: 31.604, lng: -8.089, group: 'far' },
  "M'Hamid (ancien)":   { lat: 31.598, lng: -8.071, group: 'far' },
  'Ain Mzouar':          { lat: 31.646, lng: -8.128, group: 'far' },
  'Gare routière':       { lat: 31.654, lng: -8.015, group: 'far' },
  'Gare ONCF':           { lat: 31.645, lng: -8.015, group: 'far' },
  'Guéliz':              { lat: 31.655, lng: -8.008, group: 'far' },
  'Hivernage':           { lat: 31.622, lng: -8.010, group: 'far' },
  'Bab Doukkala':        { lat: 31.636, lng: -7.995, group: 'far' },
  'Ménara':              { lat: 31.607, lng: -8.030, group: 'far' },
  'Aéroport Ménara':    { lat: 31.604, lng: -8.034, group: 'far' },
  'Abwab Guéliz':       { lat: 31.671, lng: -8.010, group: 'far' },
  'Daoudiate':           { lat: 31.664, lng: -8.003, group: 'far' },
  'Médina':              { lat: 31.629, lng: -7.989, group: 'far' },
  'Jemaa El-Fna':       { lat: 31.626, lng: -7.989, group: 'far' },
  'Mellah':              { lat: 31.619, lng: -7.984, group: 'far' },
  'Majorelle':           { lat: 31.641, lng: -8.003, group: 'far' },
  'Annakhil':            { lat: 31.649, lng: -8.001, group: 'far' },
  'Hay Mohammadi':       { lat: 31.638, lng: -8.003, group: 'far' },
  'Assif':               { lat: 31.638, lng: -8.015, group: 'far' },

  // ── VFAR > 10 km road — 25 DH ─────────────────────────────────────────
  'Agdal':               { lat: 31.610, lng: -8.004, group: 'vfar' },
  "M'Hamid 9":          { lat: 31.581, lng: -8.058, group: 'vfar' },
  "M'Hamid 10":         { lat: 31.574, lng: -8.053, group: 'vfar' },
  "M'Hamid 11":         { lat: 31.566, lng: -8.058, group: 'vfar' },
  'Ezdouhar':            { lat: 31.622, lng: -7.993, group: 'vfar' },
  'Sidi Youssef Ben Ali':{ lat: 31.608, lng: -7.994, group: 'vfar' },
  'Massar':              { lat: 31.573, lng: -8.064, group: 'vfar' },
  'Riad Salam':          { lat: 31.576, lng: -8.060, group: 'vfar' },
  'Route de Fès':        { lat: 31.705, lng: -8.002, group: 'vfar' },
  'Douar Laskar':        { lat: 31.568, lng: -8.035, group: 'vfar' },
  'Palmeraie (Sud)':    { lat: 31.666, lng: -7.958, group: 'vfar' },
  'Oasis Hassan II':    { lat: 31.734, lng: -8.049, group: 'vfar' },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface DeliveryInfo {
  minutes: number;
  distanceKm: number;
}

export function calcDeliveryInfo(neighborhood: string): DeliveryInfo {
  const data = NEIGHBORHOOD_COORDS[neighborhood];
  if (!data) return { minutes: 45, distanceKm: 0 };

  const straightKm = haversineKm(RESTAURANT.lat, RESTAURANT.lng, data.lat, data.lng);
  const roadKm = straightKm * 1.4;
  const travelMin = (roadKm / 25) * 60;
  const total = Math.ceil((travelMin + 10) / 5) * 5;

  return {
    minutes: Math.max(15, total),
    distanceKm: Math.round(roadKm * 10) / 10,
  };
}

export function calcDeliveryFee(neighborhood: string): number {
  const data = NEIGHBORHOOD_COORDS[neighborhood];
  if (!data) return 20;
  if (data.group === 'near') return 15;
  if (data.group === 'far') return 20;
  return 25;
}

export function getArrivalTime(minutes: number): string {
  return new Date(Date.now() + minutes * 60000).toLocaleTimeString('fr-MA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const NEAR_NEIGHBORHOODS = Object.entries(NEIGHBORHOOD_COORDS)
  .filter(([, v]) => v.group === 'near')
  .map(([k]) => k);

export const FAR_NEIGHBORHOODS = Object.entries(NEIGHBORHOOD_COORDS)
  .filter(([, v]) => v.group === 'far')
  .map(([k]) => k);

export const VFAR_NEIGHBORHOODS = Object.entries(NEIGHBORHOOD_COORDS)
  .filter(([, v]) => v.group === 'vfar')
  .map(([k]) => k);
