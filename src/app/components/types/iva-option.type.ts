import { DIVISOR_IVA } from "../iva/enum/iva.enum";

export type IvaOption = {
  value: DIVISOR_IVA;
  label: string;
  hint?: string;
};
