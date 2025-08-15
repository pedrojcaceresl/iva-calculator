import { Component, inject } from '@angular/core';
import { IvaService } from './services/iva.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DIVISOR_IVA } from './enum/iva.enum';
import { IvaOption } from '../types/iva-option.type';
import { CURRENCY_SYMBOLS } from './enum/currency.enum';
import { NgxCurrencyConfig, NgxCurrencyDirective, NgxCurrencyInputMode } from 'ngx-currency';


@Component({
  selector: 'app-iva',
  imports: [ReactiveFormsModule, CommonModule, NgxCurrencyDirective],
  standalone: true,
  template: `
    <div class="max-w-md mx-auto">
      <div
        class="bg-slate-800/90 backdrop-blur p-6 rounded-2xl shadow-lg text-gray-100 ring-1 ring-white/10"
      >
        <header class="mb-6">
          <h1 class="text-2xl font-semibold tracking-tight">Calculadora de IVA</h1>
          <p class="text-sm text-gray-300">Ingresa el monto y selecciona el régimen de IVA.</p>
        </header>

        <form [formGroup]="form" (ngSubmit)="calculateIVA()" class="space-y-5">
          <div>
            <label for="amount" class="block text-sm font-medium">Monto</label>
            <div class="mt-1 relative">
              <input
                id="amount"
                [currencyMask]="currencyMask"
                inputmode="decimal"
                formControlName="amount"
                placeholder="0"
                class="peer w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none
                   focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
            <p
              *ngIf="form.controls.amount.touched && form.controls.amount.invalid"
              class="mt-1 text-xs text-rose-300"
            >
              Ingresá un monto válido (≥ 0).
            </p>
          </div>

          <div>
            <label for="iva" class="block text-sm font-medium">IVA</label>
            <div class="mt-1">
              <select
                id="iva"
                formControlName="iva"
                class="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-gray-100 outline-none
                   focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 pr-6"
              >
                <option *ngFor="let opt of ivaOptions" [ngValue]="opt.value">
                  {{ opt.label }} <span *ngIf="opt.hint">({{ opt.hint }})</span>
                </option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="w-full inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white
               disabled:opacity-50 disabled:cursor-not-allowed
               hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            Calcular
          </button>
          <button type="submit" class="hidden" tabindex="-1" aria-hidden="true"></button>
        </form>

        <div *ngIf="ivaValue !== 0" class="mt-6 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-slate-900/40 p-4 ring-1 ring-white/5">
            <p class="text-xs text-gray-400">IVA</p>
            <p class="mt-1 text-lg font-semibold">
              {{ selectedCurrency }} {{ ivaValue | number : '1.0-0' }}
            </p>
          </div>
          <div class="rounded-xl bg-slate-900/40 p-4 ring-1 ring-white/5">
            <p class="text-xs text-gray-400">Valor sin IVA</p>
            <p class="mt-1 text-lg font-semibold">
              {{ selectedCurrency }} {{ netValue | number : '1.0-0' }}
            </p>
          </div>
        </div>

        <p class="mt-4 text-[11px] text-gray-400">
          Nota: En Paraguay se usa ÷11 para IVA 10% y ÷21 para IVA 5%.
        </p>
        <p class="mt-4 text-[11px] text-gray-400 text-center">
          Developed by <a href="#" class="font-bold">@PedroC</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './iva.component.css',
})
export class IvaComponent {
  selectedCurrency = CURRENCY_SYMBOLS.PYG;

  ivaOptions: IvaOption[] = [
    {
      value: DIVISOR_IVA.DIEZ,
      label: '10%',
      hint: 'IVA del 10%',
    },
    {
      value: DIVISOR_IVA.CINCO,
      label: '5%',
      hint: 'IVA del 5%',
    },
    {
      value: DIVISOR_IVA.EXENTA,
      label: '0%',
      hint: 'IVA Exento',
    },
  ];

  fb = inject(FormBuilder);
  protected readonly ivaService = inject(IvaService);

  form = this.fb.group({
    amount: [0],
    iva: [DIVISOR_IVA.DIEZ],
  });

  ivaValue: number = 0;
  netValue: number = 0;

  calculateIVA(): void {
    if (this.form.invalid) return;
    const amount = Number(this.form.value.amount);
    const divisor = Number(this.form.value.iva);

    this.ivaValue = this.ivaService.calculateIVA(amount, divisor);
    this.netValue = amount - this.ivaValue;
  }

  get currencyMask(): Partial<NgxCurrencyConfig> {
    const symbol = this.selectedCurrency;
    return {
      prefix: `${symbol}`,
      thousands: '.',
      decimal: ',',
      precision: 0,
      min: 0,
      align: 'left',
      allowNegative: false,
      inputMode: NgxCurrencyInputMode.Natural,
    };
  }
}
