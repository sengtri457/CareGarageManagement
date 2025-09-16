export interface Part {
  _id: string;
  name: string;
  sku: string;
  unitPrice: number;
  unit: string;
  availableQty: number;
  qtyStock?: number;
  location: string;
  batchNo?: string;
}
