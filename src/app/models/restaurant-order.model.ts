export interface RestaurantOrderItem {
  itemId: string;
  quantity: number;
}

export interface RestaurantOrder {
  _id?: string;
  room: string;  // Booking ID
  items: RestaurantOrderItem[];
  total: number;
  date?: string;
  status: 'Pending' | 'Delivered';
}
