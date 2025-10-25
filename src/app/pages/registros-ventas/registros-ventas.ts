import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { RegistroVenta } from '../../modelos/ventas.model';
import { Reporte } from '../../services/reporte';
import { Venta } from '../../services/venta';
import { ventaResponse } from '../../modelos/ventaResponse';
import { Detalle } from '../../services/detalle';
import { DetalleResponse } from '../../modelos/detalleResponse';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registros-ventas',
  standalone: true,
  templateUrl: './registros-ventas.html',
  styleUrls: ['./registros-ventas.scss'],
  imports: [
    CommonModule, FormsModule
  ]
})
export class RegistrosVentasComponent implements OnInit {

  reporteService = inject(Reporte);
  ventaService = inject(Venta);
  detalleService = inject(Detalle);

  ventas: ventaResponse[] = [];
  detalles: DetalleResponse[] = [];
  registrosFiltrados: RegistroVenta[] = [];
  registroSeleccionado: RegistroVenta | null = null;
  mostrarDetalle: boolean = false;
  totalVentas: string = '';

  // Filtros
  filtroCliente: string = '';
  filtroNombre: string = '';
  filtroApellido: string = '';
  filtroMedioPago: string = '';
  filtroDesde: string = '';
  filtroHasta: string = '';
  tipoVendedor: string = '';

  //paginacion
  pagina: number = 0;
  totalPaginas: number = 0;

  // Resumen
  totalVendido: number = 0;
  numeroVentas: number = 0;
  productoMasVendido: string = '';
  cantidadVendida: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.reporteService.obtenerResumen().subscribe(res => {
      this.totalVendido = res.ventasTotales;
    })
    this.ventaService.ventasMesActual().subscribe(res => {
      this.totalVentas = res
    })
    this.ventaService.obtenerVentasPage(this.pagina).subscribe(res => {
      this.ventas = res.content;
      this.totalPaginas = res.totalPages;
    })
    this.reporteService.getProductoMasVendidoMes().subscribe(res => {
      this.productoMasVendido = res.nombreProducto;
      this.cantidadVendida = res.cantidadVendida;
    });
  }

  limpiarFiltros(): void {
    this.filtroCliente = '';
    this.filtroNombre = '';
    this.filtroApellido = '';
    this.filtroMedioPago = '';
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.pagina = 0;
    this.obtenerVentas();
  }
  obtenerVentas() {
    this.ventaService.obtenerVentasPage(this.pagina).subscribe(res => {
      this.ventas = res.content;
      this.totalPaginas = res.totalPages;
    })
  }

  // Función para ver detalles de una venta
  verDetalles(venta: ventaResponse): void {
    this.detalleService.findByIdVenta(venta.idVenta).subscribe(res => {
      this.detalles = res;
      this.mostrarDetalle = true; // 👈 Mostrar modal
    });
  }

  // Cerrar el modal
  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.detalles = [];
  }
  get totalVenta(): number {
    if (!this.detalles || this.detalles.length === 0) return 0;
    return this.detalles.reduce((acc, det) => acc + (det.cantidadProducto * det.precioProducto), 0);
  }

  // Función para anular una venta
  anularVenta(venta: ventaResponse): void {

  }

  aplicarFiltros() {
    if (this.filtroDesde && this.filtroHasta) {
      const desde = new Date(this.filtroDesde);
      const hasta = new Date(this.filtroHasta);

      if (desde > hasta) {
        Swal.fire({
          icon: 'error',
          title: 'Rango de fechas inválido',
          text: 'La fecha de inicio no puede ser posterior a la fecha fin.',
          confirmButtonColor: '#d33'
        });
        return;
      }
    }
    debugger;
    this.ventaService.filtrarVentas(
      this.filtroNombre,
      this.filtroApellido,
      this.filtroCliente,
      this.filtroMedioPago,
      this.filtroDesde,
      this.filtroHasta,
      this.pagina
    ).subscribe({
      next: (data) => {
        this.ventas = data.content.sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.totalPaginas = data.totalPages;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al filtrar',
          text: err.error || 'Ocurrió un error al filtrar los movimientos.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
  avanzarPagina() {
    if (this.pagina >= this.totalPaginas - 1) return;
    this.pagina++;
    this.aplicarFiltros();
  }

  atrasarPagina() {
    if (this.pagina <= 0) return;
    this.pagina--;
    this.aplicarFiltros();
  }
}

