import { Injectable } from '@angular/core';
import { DIVISOR_IVA } from '../enum/iva.enum';


@Injectable({
  providedIn: 'root',
})
export class IvaService {
  constructor() {}

  public calculateIVA(amount: number, iva: DIVISOR_IVA): number {
    console.log(iva, amount)
    return amount && iva > 0 ? amount / iva : 0;
  }
}
