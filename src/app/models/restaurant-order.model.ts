export interface RestaurantOrderItem {
  itemId: string;   // RestaurantItem ID
  quantity: number;
}

export interface RestaurantOrder {
  _id?: string;

  // Room booking OR direct customer
  room?: string | null;     // Booking ID or null if direct customer

  // Optional customer reference
  customer?: string | null; // Customer ID

  items: RestaurantOrderItem[];

  total: number;

  date?: string;

  status: 'Pending' | 'Delivered';
}