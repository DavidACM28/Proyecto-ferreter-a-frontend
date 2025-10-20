import { Component, inject, OnInit } from '@angular/core';
import { Auditoria } from '../../../services/auditoria';
import { auditoriaResponse } from '../../../modelos/auditoriaResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimientos',
  imports: [CommonModule, FormsModule],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.scss'
})
export class MovimientosComponent implements OnInit {

  auditoriaService = inject(Auditoria);
  auditorias: auditoriaResponse[] = [];
  pagina = 0;
  totalPaginas = 0;
  mostrarModalVer: boolean = false;
  movimientoSeleccionado: auditoriaResponse | null = null;

  // 🧩 Filtros
  filtroProducto: string = '';
  filtroTipo: string = '';
  filtroDesde: string = '';
  filtroHasta: string = '';

  // 📊 Indicadores
  totalMovimientos: number = 0;
  ultimoMovimiento: auditoriaResponse | null = null;
  variacion: number = 0;

  ngOnInit(): void {
    this.obtenerAuditorias();
  }

  obtenerAuditorias() {
    this.auditoriaService.obtenerAuditorias(this.pagina).subscribe(data => {
      this.auditorias = data.content.sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      this.totalPaginas = data.totalPages;
      this.calcularIndicadores();
    });
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

    this.auditoriaService.filtrarAuditorias(
      this.filtroProducto,
      this.filtroTipo,
      this.filtroDesde,
      this.filtroHasta,
      this.pagina
    ).subscribe({
      next: (data) => {
        this.auditorias = data.content.sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.totalPaginas = data.totalPages;
        this.calcularIndicadores();
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

  limpiarFiltros() {
    this.filtroProducto = '';
    this.filtroTipo = '';
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.pagina = 0;
    this.obtenerAuditorias();
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

  abrirModalVer(auditoria: auditoriaResponse) {
    this.movimientoSeleccionado = auditoria;
    this.mostrarModalVer = true;
  }

  cerrarModalVer() {
    this.mostrarModalVer = false;
    this.movimientoSeleccionado = null;
  }

  // 📊 Calcular indicadores
  calcularIndicadores() {
    this.totalMovimientos = this.auditorias.length;
    this.ultimoMovimiento = this.auditorias[0] || null;
    this.variacion = this.auditorias.reduce((acum, aud) => {
      const diff = (aud.cantidadNueva ?? 0) - (aud.cantidadAnterior ?? 0);
      return acum + diff;
    }, 0);
  }

  // 🧭 Nueva función: determina si fue Ingreso o Salida
  obtenerTipoMovimiento(auditoria: auditoriaResponse): string {
    if (!auditoria) return '';
    if (auditoria.cantidadNueva > auditoria.cantidadAnterior) return 'Ingreso';
    if (auditoria.cantidadNueva < auditoria.cantidadAnterior) return 'Salida';
    return 'Sin cambio';
  }
}
