import { Component, signal } from '@angular/core';
import { IvaComponent } from './components/iva/iva.component';

@Component({
  selector: 'app-root',
  imports: [IvaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Calculadora IVA');
}
