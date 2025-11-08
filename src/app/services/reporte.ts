import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Reporte {
  private base = 'https://proyecto-ferreter-a-backend.onrender.com/api/reportes';

  constructor(private http: HttpClient) { }

  obtenerResumen(): Observable<any> {
    return this.http.get(`${this.base}/resumen`);
  }

  productosMasVendidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/productos-mas-vendidos`);
  }

  ventasPorMes(meses = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/ventas-por-mes?meses=${meses}`);
  }

  obtenerVentasPorRango(inicio: string, fin: string) {
    return this.http.get<any>(`${this.base}/ventas-por-rango?inicio=${inicio}&fin=${fin}`);
  }

  getProductoMasVendidoMes() {
    return this.http.get<any>(`https://proyecto-ferreter-a-backend.onrender.com/venta/producto-mas-vendido-mes`);
  }
}
