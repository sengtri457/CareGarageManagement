import { Part } from '../Models/part';
import { Service } from '../Models/service';

export function calculatePartsTotal(
  parts: Part[],
  partQty: Record<string, number>
): number {
  return parts.reduce((sum, part) => {
    const qty = partQty[part._id] || 0;
    return sum + part.unitPrice * qty;
  }, 0);
}

export function calculateServicesTotal(services: Service[]): number {
  return services.reduce((sum, service) => sum + service.basePrice, 0);
}

export function calculateGrandTotal(
  partsTotal: number,
  servicesTotal: number
): number {
  return partsTotal + servicesTotal;
}

export function formatCurrency(
  amount: number,
  locale = 'en-US',
  currency = 'USD'
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    amount
  );
}
