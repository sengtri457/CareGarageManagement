export interface Machine {
  _id: string;
  name: string;
  serialNo: string;
  type: string;
  lastServiceAt: string | Date;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
