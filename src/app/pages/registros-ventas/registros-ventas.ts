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
      
    }

    cargarVentas(): void {
      
    }

    filtrarRegistros(): void {
    }

    limpiarFiltros(): void {
    }

    actualizarTotales(): void {
    }

    // Ejemplo de acción (ver detalles)
    verDetalle(venta: RegistroVenta): void {
    }

    calcularCambioSemanal() {
  }

    // Función para ver detalles de una venta
  verDetalles(registro: RegistroVenta): void {
  }

  cerrarDetalle(): void {
  }

  // Función para anular una venta
  anularVenta(venta: RegistroVenta): void {
  
  }
}

