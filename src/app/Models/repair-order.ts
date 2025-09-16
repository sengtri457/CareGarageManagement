import { Service } from './service';
import { Part } from './part';

export interface ServicePerformed {
  serviceId: string;
  price?: number;
  basePrice?: number;
}

export interface PartUsed {
  partId: string;
  quantity: number;
  pricePerUnit: number;
  location: string;
}

export interface MachineSnapshot {
  name: string;
  serialNo: string;
  type: string;
  lastServiceAt?: string | Date;
  active: boolean;
}

export interface MechanicSnapshot {
  firstName: string;
  lastName: string;
  specialization?: string;
  hourlyRate?: number;
}

export interface RepairOrder {
  customerId: string | null;
  vehicleId: string | null;
  servicesPerformed: ServicePerformed[];
  partsUsed: PartUsed[];
  machineUsed: string | null;
  machineSnapshot?: MachineSnapshot;
  mechanicSnapshot?: MechanicSnapshot;
  mechanicId: string | null;
  date: Date;
  totalCost: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  customerSnapshot?: {
    name: string;
    phone?: string;
    email?: string;
  };
}
