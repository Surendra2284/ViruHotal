export interface RestaurantItem {
  _id?: string;
  name: string;
  category: string;   // Breakfast, Lunch, Dinner, Snacks
  price: number;
  available: boolean;
}

