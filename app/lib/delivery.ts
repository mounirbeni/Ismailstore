const RESTAURANT = { lat: 31.6461, lng: -8.0714 };

const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number; group: 'near' | 'far' }> = {
  // Near — west/northwest of restaurant, < 5 km
  'Massira 1':            { lat: 31.6374, lng: -8.0558, group: 'near' },
  'Massira 2':            { lat: 31.6244, lng: -8.0518, group: 'near' },
  'Massira 3':            { lat: 31.6172, lng: -8.0492, group: 'near' },
  'Massira 4':            { lat: 31.6103, lng: -8.0462, group: 'near' },
  'Hay Salam':            { lat: 31.6224, lng: -8.0398, group: 'near' },
  'Amerchich':            { lat: 31.6414, lng: -8.0284, group: 'near' },
  'Sidi Ghanem':          { lat: 31.6638, lng: -8.0572, group: 'near' },
  'Route de Casablanca':  { lat: 31.6668, lng: -8.0892, group: 'near' },
  // Far — city centre and beyond, > 5 km
  "M'Hamid":              { lat: 31.5960, lng: -8.0138, group: 'far' },
  'Sidi Youssef Ben Ali': { lat: 31.6082, lng: -7.9938, group: 'far' },
  'Hay Mohammadi':        { lat: 31.6380, lng: -8.0032, group: 'far' },
  'Assif':                { lat: 31.6210, lng: -8.0218, group: 'far' },
  'Médina':               { lat: 31.6258, lng: -7.9895, group: 'far' },
  'Guéliz':               { lat: 31.6322, lng: -8.0108, group: 'far' },
  'Hivernage':            { lat: 31.6178, lng: -8.0132, group: 'far' },
  'Majorelle':            { lat: 31.6414, lng: -8.0032, group: 'far' },
  'Bab Doukkala':         { lat: 31.6374, lng: -7.9872, group: 'far' },
  'Mellah':               { lat: 31.6188, lng: -7.9838, group: 'far' },
  'Daoudiate':            { lat: 31.6504, lng: -8.0178, group: 'far' },
  'Targa':                { lat: 31.6598, lng: -8.0108, group: 'far' },
  'Annakhil':             { lat: 31.6494, lng: -8.0012, group: 'far' },
  'Palmeraie':            { lat: 31.6598, lng: -7.9528, group: 'far' },
  'Route de Fès':         { lat: 31.6778, lng: -7.9678, group: 'far' },
  "Route d'Ourika":       { lat: 31.5678, lng: -7.9478, group: 'far' },
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
  // Road factor 1.4 accounts for streets not being straight lines
  const roadKm = straightKm * 1.4;
  // Average motorcycle speed in Marrakech city traffic: ~25 km/h
  const travelMin = (roadKm / 25) * 60;
  // Add 10 min preparation time, round up to nearest 5 min
  const total = Math.ceil((travelMin + 10) / 5) * 5;

  return {
    minutes: Math.max(15, total),
    distanceKm: Math.round(roadKm * 10) / 10,
  };
}

export function calcDeliveryFee(neighborhood: string): number {
  const data = NEIGHBORHOOD_COORDS[neighborhood];
  if (!data) return 15;
  return data.group === 'near' ? 15 : 20;
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
