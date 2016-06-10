
export interface Reservation {
  table: string;
  person: string;
  start: number; // epoch time when the reservation done
  end: number;// epoch time when the reservation ends
}