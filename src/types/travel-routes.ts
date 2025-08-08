export type TravelRoute = {
  id: string;
  departure_city: string;
  destination_city: string;
  vehicle: string;
  total_seat: number;
  price: number;
  schedules: {
    departure_time: string;
    arrival_time: string;
  }[];
};
