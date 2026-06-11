import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaldoBlockchainService, EstadoSaldoBlockchain } from '../../core/blockchain/saldo-blockchain.service';

/**
 * Tarjeta que muestra el saldo de POL disponible en Polygon Amoy (testnet)
 * y cuantas recetas mas se pueden registrar antes de quedarse sin gas.
 *
 * Uso: <app-saldo-blockchain></app-saldo-blockchain>
 * (es standalone; importarlo en el componente/pagina que lo use).
 */
@Component({
  selector: 'app-saldo-blockchain',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card saldo-card">
      <div class="saldo-header">
        <h3><i class="pi pi-wallet"></i> Saldo blockchain</h3>
        <button class="btn-secondary" (click)="cargar()" [disabled]="cargando" title="Actualizar saldo">
          <i class="pi" [ngClass]="cargando ? 'pi-spin pi-spinner' : 'pi-refresh'"></i>
        </button>
      </div>

      <!-- Cargando -->
      <p *ngIf="cargando && !estado" class="saldo-muted">Consultando Polygon Amoy…</p>

      <!-- Servicio no desplegado en este entorno: aviso neutro, no es un error del usuario -->
      <div *ngIf="noDisponible" class="saldo-aviso">
        <i class="pi pi-info-circle"></i>
        El servicio blockchain no está disponible en este entorno. El saldo y el registro on-chain se activarán cuando se despliegue.
      </div>

      <!-- Error -->
      <div *ngIf="error" class="saldo-error">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ error }}</span>
      </div>

      <!-- Datos -->
      <ng-container *ngIf="estado && !error">
        <div class="saldo-monto" *ngIf="estado.saldoPol !== null; else sinFirmante">
          <span class="saldo-valor">{{ formatPol(estado.saldoPol) }}</span>
          <span class="saldo-unidad">POL</span>
        </div>
        <ng-template #sinFirmante>
          <p class="saldo-muted">El servicio corre en modo solo lectura (sin wallet configurada).</p>
        </ng-template>

        <div class="saldo-grid" *ngIf="estado.saldoPol !== null">
          <div class="saldo-item">
            <span class="saldo-label">Recetas restantes (aprox.)</span>
            <span class="saldo-dato">{{ estado.registrosRestantesEstimados ?? '—' }}</span>
          </div>
          <div class="saldo-item">
            <span class="saldo-label">Costo por receta</span>
            <span class="saldo-dato">{{ formatPol(estado.costoEstimadoPol) }} POL</span>
          </div>
          <div class="saldo-item">
            <span class="saldo-label">Gas actual</span>
            <span class="saldo-dato">{{ estado.gasPriceGwei ?? '—' }} gwei</span>
          </div>
        </div>

        <!-- Aviso de saldo bajo -->
        <div class="saldo-aviso" *ngIf="saldoBajo">
          <i class="pi pi-info-circle"></i>
          Saldo bajo. Recarga POL gratis desde el faucet de Amoy.
        </div>

        <div class="saldo-footer">
          <span class="saldo-red">{{ estado.red }}</span>
          <div class="saldo-links">
            <a [href]="urlContrato" target="_blank" rel="noopener">Ver contrato ↗</a>
            <a href="https://faucet.polygon.technology" target="_blank" rel="noopener">Recargar POL ↗</a>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .saldo-card { max-width: 420px; }
    .saldo-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: .75rem;
    }
    .saldo-header h3 { margin: 0; font-size: 1rem; }
    .saldo-monto { display: flex; align-items: baseline; gap: .4rem; margin: .25rem 0 1rem; }
    .saldo-valor { font-size: 2rem; font-weight: 700; line-height: 1; }
    .saldo-unidad { font-size: 1rem; color: #6b7280; font-weight: 600; }
    .saldo-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: .75rem;
    }
    .saldo-item { display: flex; flex-direction: column; gap: .15rem; }
    .saldo-label { font-size: .72rem; color: #6b7280; text-transform: uppercase; letter-spacing: .03em; }
    .saldo-dato { font-size: 1.05rem; font-weight: 600; }
    .saldo-muted { color: #6b7280; font-size: .9rem; }
    .saldo-error {
      display: flex; align-items: center; gap: .5rem;
      background: #fef2f2; color: #b91c1c; padding: .6rem .75rem; border-radius: 8px;
      font-size: .85rem;
    }
    .saldo-aviso {
      display: flex; align-items: center; gap: .5rem;
      background: #fffbeb; color: #92400e; padding: .5rem .75rem; border-radius: 8px;
      font-size: .82rem; margin-bottom: .75rem;
    }
    .saldo-footer {
      display: flex; justify-content: space-between; align-items: center;
      border-top: 1px solid #e5e7eb; padding-top: .6rem; font-size: .8rem;
    }
    .saldo-red { color: #6b7280; }
    .saldo-links { display: flex; gap: .9rem; }
    .saldo-links a { color: #6d28d9; text-decoration: none; font-weight: 600; }
    .saldo-links a:hover { text-decoration: underline; }
  `]
})
export class SaldoBlockchainComponent implements OnInit {
  private saldoService = inject(SaldoBlockchainService);

  estado: EstadoSaldoBlockchain | null = null;
  cargando = false;
  error: string | null = null;
  /** true cuando ms-blockchain no esta desplegado/alcanzable en este entorno. */
  noDisponible = false;

  ngOnInit(): void {
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = null;
    this.noDisponible = false;
    try {
      this.estado = await this.saldoService.obtenerEstado();
    } catch (e: any) {
      if (e?.name === 'BlockchainNoDisponible') {
        this.noDisponible = true;
      } else {
        this.error = e?.message || 'No se pudo consultar el saldo en Polygon Amoy.';
      }
    } finally {
      this.cargando = false;
    }
  }

  /** true si quedan menos de 5 recetas por registrar. */
  get saldoBajo(): boolean {
    const r = this.estado?.registrosRestantesEstimados;
    return r !== null && r !== undefined && r < 5;
  }

  get urlContrato(): string {
    if (!this.estado) return '#';
    return `${this.estado.explorer}/address/${this.estado.contractAddress}`;
  }

  /** Recorta el POL a 4 decimales para mostrarlo legible. */
  formatPol(valor: string | null): string {
    if (valor === null) return '—';
    const n = Number(valor);
    return Number.isFinite(n) ? n.toFixed(4) : valor;
  }
}
