export interface Bill {
  _id?: string;
  booking: any;      // populated Booking object
  roomCost: number;
  restaurantCost: number;
  gst: number;
  total: number;
  date: string;
}
