export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  customerId: string;
}
