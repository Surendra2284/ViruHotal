export interface Room {
  _id?: string;
  roomNumber: string;
  type: string;  // AC, Non-AC, Deluxe
  price: number;
  status?: 'Available' | 'Occupied' ;
  name: string;
}
