import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RegistroVenta } from '../../modelos/ventas.model';


@Component({
  selector: 'app-registros-ventas',
  standalone: true,
  templateUrl: './registros-ventas.html',
  styleUrls: ['./registros-ventas.scss'],
  imports:[
    CommonModule,FormsModule
  ]
})
export class RegistrosVentasComponent implements OnInit {
    ventas: RegistroVenta[] = [];
    registrosFiltrados: RegistroVenta[] = [];
    registroSeleccionado: RegistroVenta | null = null;
    mostrarDetalle: boolean = false;

    // Filtros
    filtroTexto: string = '';
    fechaDesde: string = '';
    fechaHasta: string = '';
    tipoVendedor: string = '';
    tipoPago: string = '';


    // Resumen
    totalVendido: number = 0;
    numeroVentas: number = 0;
    cambioSemanal: number = 0;

    constructor() {}

    ngOnInit(): void {
      this.cargarVentas();
    }

    cargarVentas(): void {
      
    }

    filtrarRegistros(): void {
      const texto = this.filtroTexto.toLowerCase().trim();
      const desde = this.fechaDesde ? new Date(this.fechaDesde) : null;
      const hasta = this.fechaHasta ? new Date(this.fechaHasta) : null;

      const vendedorTipoMap: Record<string, string> = {
      'María López': 'admin',
      'Juan Pérez': 'vendedor1',
    };

      this.registrosFiltrados = this.ventas.filter(v => {
        const fechaVenta = new Date(v.fecha);

        const coincideTexto =
          !texto ||
          v.idVenta.toLowerCase().includes(texto) ||
          v.cliente.nombre.toLowerCase().includes(texto) ||
          v.vendedor.nombre.toLowerCase().includes(texto);

          // 🔹 Filtrado por rango de fechas
          const coincideDesde = !desde || fechaVenta >= desde;
          const coincideHasta = !hasta || fechaVenta <= hasta;

          // 🔹 Filtrado por tipo de vendedor
          let coincideTipoVendedor = true;
          if (this.tipoVendedor) {
            coincideTipoVendedor = v.vendedor.id === this.tipoVendedor;
          }

          let coincideTipoPago = true;
          if (this.tipoPago) {
            coincideTipoPago = v.metodoPago.toLowerCase() === this.tipoPago;
          }
        return coincideTexto && coincideDesde && coincideHasta && coincideTipoVendedor && coincideTipoPago;

      });

      this.actualizarTotales();
    }

    limpiarFiltros(): void {
      this.filtroTexto = '';
      this.fechaDesde = '';
      this.fechaHasta = '';
      this.registrosFiltrados = [...this.ventas];
      this.tipoVendedor = '';
      this.tipoPago = '';
      this.actualizarTotales();
    }

    actualizarTotales(): void {
      this.numeroVentas = this.registrosFiltrados.length;
      this.totalVendido = this.registrosFiltrados.reduce((acc, v) => acc + v.total, 0);
    }

    // Ejemplo de acción (ver detalles)
    verDetalle(venta: RegistroVenta): void {
      console.log('Ver detalle de venta:', venta);
    }

    calcularCambioSemanal() {

    const hoy = new Date();
    const diaSemana = hoy.getDay();

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - diaSemana);

    const inicioSemanaAnterior = new Date(inicioSemana);
    inicioSemanaAnterior.setDate(inicioSemana.getDate() - 7);

    const finSemanaAnterior = new Date(inicioSemana);
    finSemanaAnterior.setDate(inicioSemana.getDate() - 1);

    const ventasEstaSemana = this.registrosFiltrados.filter(r => new Date(r.fecha) >= inicioSemana).length;
    const ventasSemanaAnterior = this.registrosFiltrados.filter(r => {
      const fecha = new Date(r.fecha);
      return fecha >= inicioSemanaAnterior && fecha <= finSemanaAnterior;
    }).length;

    this.cambioSemanal = ventasSemanaAnterior === 0 ? ventasEstaSemana * 100 : Math.round(((ventasEstaSemana - ventasSemanaAnterior) / ventasSemanaAnterior) * 100);
  }

    // Función para ver detalles de una venta
  verDetalles(registro: RegistroVenta): void {
    this.registroSeleccionado = registro;
    this.mostrarDetalle = true; // si manejas boolean para mostrar panel
  }

  cerrarDetalle(): void {
    this.registroSeleccionado = null;
    this.mostrarDetalle = false;
  }

  // Función para anular una venta
  anularVenta(venta: RegistroVenta): void {
  
  }
}

