export interface Booking {
  _id?: string;
  customerName: string;
  phone: string;
  aadhar: string;
  address: string;
  room: any; // populated Room object
  checkIn: string;
  checkOut: string;
  status: 'Booked' | 'CheckedIn' | 'CheckedOut';
  restaurantOrders?: string[]; // array of RestaurantOrder IDs
}
