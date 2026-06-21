const RESTAURANT = { lat: 31.6461, lng: -8.0714 };

// Approximate center coordinates for each Marrakech neighborhood
const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number; group: 'near' | 'far' }> = {
  'Massira 1':            { lat: 31.6110, lng: -8.0340, group: 'near' },
  'Massira 2':            { lat: 31.6090, lng: -8.0352, group: 'near' },
  'Massira 3':            { lat: 31.6068, lng: -8.0365, group: 'near' },
  'Massira 4':            { lat: 31.6048, lng: -8.0378, group: 'near' },
  'Hay Salam':            { lat: 31.6135, lng: -8.0292, group: 'near' },
  'Amerchich':            { lat: 31.6195, lng: -8.0248, group: 'near' },
  "M'Hamid":              { lat: 31.5955, lng: -8.0258, group: 'near' },
  'Sidi Youssef Ben Ali': { lat: 31.6118, lng: -8.0168, group: 'near' },
  'Hay Mohammadi':        { lat: 31.6278, lng: -8.0082, group: 'near' },
  'Assif':                { lat: 31.6148, lng: -8.0215, group: 'near' },
  'Médina':               { lat: 31.6295, lng: -7.9896, group: 'far' },
  'Guéliz':               { lat: 31.6368, lng: -8.0122, group: 'far' },
  'Hivernage':            { lat: 31.6220, lng: -8.0118, group: 'far' },
  'Majorelle':            { lat: 31.6390, lng: -8.0088, group: 'far' },
  'Bab Doukkala':         { lat: 31.6332, lng: -8.0022, group: 'far' },
  'Mellah':               { lat: 31.6268, lng: -7.9872, group: 'far' },
  'Daoudiate':            { lat: 31.6498, lng: -8.0198, group: 'far' },
  'Targa':                { lat: 31.6618, lng: -8.0148, group: 'far' },
  'Annakhil':             { lat: 31.6448, lng: -8.0052, group: 'far' },
  'Palmeraie':            { lat: 31.6598, lng: -7.9602, group: 'far' },
  'Sidi Ghanem':          { lat: 31.6698, lng: -8.0498, group: 'far' },
  'Route de Fès':         { lat: 31.6798, lng: -7.9798, group: 'far' },
  "Route d'Ourika":       { lat: 31.5698, lng: -7.9502, group: 'far' },
  'Route de Casablanca':  { lat: 31.6898, lng: -8.0798, group: 'far' },
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
