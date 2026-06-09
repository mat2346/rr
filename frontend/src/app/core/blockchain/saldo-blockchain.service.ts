import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '../auth/supabase.service';

/**
 * Respuesta del endpoint GET /recetas/gas de ms-blockchain.
 * Refleja el costo de registrar una receta nueva al precio de gas actual de
 * Polygon Amoy, el saldo del firmante y cuantas registraciones mas alcanzan.
 */
export interface EstadoSaldoBlockchain {
  muestra: boolean;
  yaRegistrado: boolean;
  hashHex: string;
  gas: string;
  gasPriceGwei: number | null;
  costoEstimadoWei: string;
  costoEstimadoPol: string;
  /** Saldo nativo (POL) del firmante. null si el server corre sin PRIVATE_KEY. */
  saldoPol: string | null;
  /** Cuantas recetas mas se pueden registrar a este precio. null si no aplica. */
  registrosRestantesEstimados: number | null;
  contractAddress: string;
  red: string;
  explorer: string;
}

@Injectable({ providedIn: 'root' })
export class SaldoBlockchainService {
  private supabase = inject(SupabaseService);
  private readonly baseUrl = environment.blockchainUrl;

  /**
   * Consulta el saldo de POL en Polygon Amoy y el costo estimado de una receta.
   * Es una LECTURA: no gasta gas ni difunde ninguna transaccion.
   */
  async obtenerEstado(): Promise<EstadoSaldoBlockchain> {
    const token = await this.supabase.getAccessToken();

    const res = await fetch(`${this.baseUrl}/recetas/gas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // El endpoint exige JWT (auth()); reutilizamos el de Supabase.
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!res.ok) {
      const detalle = await res.text().catch(() => '');
      throw new Error(`ms-blockchain respondio ${res.status}: ${detalle || res.statusText}`);
    }

    return res.json();
  }
}
