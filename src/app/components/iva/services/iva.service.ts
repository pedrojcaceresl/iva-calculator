import { Injectable } from '@angular/core';
import { DIVISOR_IVA } from '../enum/iva.enum';


@Injectable({
  providedIn: 'root',
})
export class IvaService {
  constructor() {}

  public calculateIVA(amount: number, iva: DIVISOR_IVA): number {
    return amount > 0 ? amount / iva : 0;
  }
}
