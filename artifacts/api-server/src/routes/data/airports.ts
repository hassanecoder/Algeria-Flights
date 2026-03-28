export const AIRPORTS = [
  { code: "ALG", name: "Houari Boumediene Airport", city: "Alger", region: "Alger", country: "Algeria" },
  { code: "ORN", name: "Ahmed Ben Bella Airport", city: "Oran", region: "Oran", country: "Algeria" },
  { code: "CZL", name: "Mohamed Boudiaf International Airport", city: "Constantine", region: "Constantine", country: "Algeria" },
  { code: "AAE", name: "Rabah Bitat Airport", city: "Annaba", region: "Annaba", country: "Algeria" },
  { code: "TLM", name: "Zenata Airport", city: "Tlemcen", region: "Tlemcen", country: "Algeria" },
  { code: "BJA", name: "Soummam Airport", city: "Béjaïa", region: "Béjaïa", country: "Algeria" },
  { code: "SKI", name: "Ain Arnat Airport", city: "Sétif", region: "Sétif", country: "Algeria" },
  { code: "BSK", name: "Mohamed Khider Airport", city: "Biskra", region: "Biskra", country: "Algeria" },
  { code: "GJL", name: "Jijel Ferhat Abbas Airport", city: "Jijel", region: "Jijel", country: "Algeria" },
  { code: "TID", name: "Abdelhafid Boussouf Airport", city: "Tiaret", region: "Tiaret", country: "Algeria" },
  { code: "TMR", name: "Aguenar Airport", city: "Tamanrasset", region: "Tamanrasset", country: "Algeria" },
  { code: "HME", name: "Oued Irara Airport", city: "Hassi Messaoud", region: "Ouargla", country: "Algeria" },
  { code: "OGX", name: "Ain Beida Airport", city: "Ouargla", region: "Ouargla", country: "Algeria" },
  { code: "ELU", name: "Guemar Airport", city: "El Oued", region: "El Oued", country: "Algeria" },
  { code: "LOO", name: "Laghouat Airport", city: "Laghouat", region: "Laghouat", country: "Algeria" },
];

export type Airport = (typeof AIRPORTS)[0];

export function getAirportByCode(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code);
}
