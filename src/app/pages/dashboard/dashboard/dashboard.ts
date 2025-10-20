import { Component, inject, OnInit } from '@angular/core';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { Reporte } from '../../../services/reporte';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Categorias } from '../../../services/categorias';
import { Productos } from '../../../services/productos';
import { productosResponse } from '../../../modelos/productosResponse';
import { categoriasResponse } from '../../../modelos/categoriasResponse';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, DecimalPipe, FormsModule, SweetAlert2Module],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  ventasTotales = 0;
  totalProductos = 0;
  productosMasVendidos: any[] = [];

  barData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ data: [], label: 'Vendidos' }] };
  barOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };

  lineData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ data: [], label: 'Ventas' }] };
  lineOptions: ChartConfiguration<'line'>['options'] = { responsive: true };

  fechaInicio!: string;
  fechaFin!: string;
  ventasRango: any = null;

  categoriaService = inject(Categorias);
  productosService = inject(Productos);

  ventasRangoData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Ventas filtradas' }]
  };
  ventasRangoOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  topCategoriaData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Vendidos por categoría' }]
  };
  topCategoriaOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };

  productos: productosResponse[] = [];
  categorias: categoriasResponse[] = [];
  productoSeleccionado: string = '';
  categoriaSeleccionada: string = '';

  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private reporteService: Reporte, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarProductosMasVendidos();
    this.cargarVentasPorMes(6);
    this.cargarProductosMasVendidosPorCategoria();
    this.cargarFiltros();
  }

  cargarResumen() {
    this.reporteService.obtenerResumen().subscribe(res => {
      this.ventasTotales = res.ventasTotales;
      this.totalProductos = res.totalProductos;
    });
  }

  cargarProductosMasVendidos() {
    this.reporteService.productosMasVendidos().subscribe(res => {
      this.productosMasVendidos = res;
      this.barData = {
        labels: res.map(r => r.nombreProducto),
        datasets: [{ data: res.map(r => r.totalVendido), label: 'Unidades vendidas' }]
      };
    });
  }

  cargarVentasPorMes(meses: number) {
    this.reporteService.ventasPorMes(meses).subscribe(res => {
      res.sort((a, b) => (a.year - b.year) || (a.month - b.month));
      this.lineData = {
        labels: res.map(r => `${r.month}/${r.year}`),
        datasets: [{ data: res.map(r => r.total), label: 'Total ventas' }]
      };
    });
  }

  consultarVentasPorRango() {
    if (!this.fechaInicio || !this.fechaFin) {
      Swal.fire({ icon: "error", title: "Error", text: "Debes seleccionar ambas fechas para continuar." });
      return;
    }

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    if (inicio > fin) {
      Swal.fire({ icon: "error", title: "Error", text: "La fecha de inicio no puede ser posterior a la de fin." });
      return;
    }

    if (this.productoSeleccionado && this.categoriaSeleccionada) {
      const producto = this.productos.find(p => p.idProducto === +this.productoSeleccionado);
      if (producto && producto.categoria?.idCategoria !== +this.categoriaSeleccionada) {
        Swal.fire({
          icon: "error",
          title: "Error de coincidencia",
          text: "El producto seleccionado no pertenece a la categoría elegida."
        });
        return;
      }
    }

    // ✅ CORRECCIÓN — ajustar la fecha fin sumando un día para incluir el día completo
    const finDate = new Date(this.fechaFin);
    finDate.setDate(finDate.getDate() + 1);

    let params = new HttpParams()
      .set('inicio', this.fechaInicio)
      .set('fin', finDate.toISOString().split('T')[0]); // yyyy-MM-dd

    if (this.productoSeleccionado) params = params.set('productoId', this.productoSeleccionado);
    if (this.categoriaSeleccionada) params = params.set('categoriaId', this.categoriaSeleccionada);

    this.http.get(`${this.apiUrl}/ventas-filtradas`, { params }).subscribe({
      next: (data: any) => {
        this.ventasRango = data;

        if (data.detalleVentas && Array.isArray(data.detalleVentas)) {
          const labelsFormateadas = data.detalleVentas.map((v: any) => {
            const [day, month, year] = v.fecha.split('-').map(Number);
            const fecha = new Date(year, month - 1, day);
            return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
          });

          this.ventasRangoData = {
            labels: labelsFormateadas,
            datasets: [{
              data: data.detalleVentas.map((v: any) => v.total),
              label: 'Ventas filtradas',
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.3)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          };
        } else {
          this.ventasRangoData = { labels: [], datasets: [{ data: [], label: 'Ventas filtradas' }] };
        }
      },
      error: (err) => {
        console.error('Error al consultar ventas filtradas:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los datos filtrados.' });
      }
    });
  }

  cargarProductosMasVendidosPorCategoria() {
    this.http.get<any[]>(`${this.apiUrl}/productos-mas-vendidos`)
      .subscribe({
        next: (data) => {
          this.topCategoriaData = {
            labels: data.map(item => `${item.categoria} - ${item.producto}`),
            datasets: [{
              data: data.map(item => item.cantidadVendida),
              label: 'Cantidad vendida',
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
              borderColor: '#FF9F40'
            }]
          };
        },
        error: (err) => console.error('Error cargando productos por categoría:', err)
      });
  }

  cargarFiltros() {
    this.productosService.obtenerProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('Error cargando productos:', err)
    });

    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }
}
