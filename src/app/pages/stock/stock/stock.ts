import { Component, inject, OnInit } from '@angular/core';
import { Productos } from '../../../services/productos';
import { productosResponse } from '../../../modelos/productosResponse';
import { Categorias } from '../../../services/categorias';
import { categoriasResponse } from '../../../modelos/categoriasResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Venta } from '../../../services/venta';
import { Trabajador } from '../../../modelos/trabajador';
import { AuditoriaBody } from '../../../modelos/auditoriaBody';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.html',
  styleUrl: './stock.scss'
})
export class StockComponent implements OnInit {

  productosService = inject(Productos);
  categoriasService = inject(Categorias);
  ventaService = inject(Venta);
  productos: productosResponse[] = [];
  productosFiltrados: productosResponse[] = [];
  categorias: categoriasResponse[] = [];
  categoriaSeleccionada: string = 'Todas las categorías';
  unidadesEnAlmacen: number = 0;
  totalUnidadesStockBajo: number = 0;
  totalUnidadesStockSin: number = 0;
  busqueda: string = '';
  razonDeCambio: string = '';
  estado = 'Todos';
  orden = 'id';
  mostrarModal: boolean = false;
  modoEdicion = false;
  cambioStock = false;
  stockAnterior: number = 0;
  stockNuevo: number = 0;
  productoSeleccionado: productosResponse | null = null;
  http = inject(HttpClient);


  // 🔹 NUEVO: IA
  mostrarModalIA: boolean = false;
  loadingIA: boolean = false;
  prediccionesIA: any[] = [];

  ngOnInit(): void {
    this.productosService.obtenerProductos().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data;
      this.unidadesEnAlmacen = data.reduce((acum, producto) => acum + producto.cantidadProducto!, 0);
      this.productos.forEach(producto => {
        if (producto.cantidadProducto! < 10 && producto.cantidadProducto! > 0) {
          this.totalUnidadesStockBajo++;
        } else if (producto.cantidadProducto! == 0) {
          this.totalUnidadesStockSin++;
        }
      });
    });
    this.categoriasService.obtenerCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  // 🔹 NUEVO: Obtener predicciones IA
  obtenerPrediccionesIA() {
    this.mostrarModalIA = true;
    this.loadingIA = true;
    this.http.get<any[]>('http://localhost:8080/prediccion/compras').subscribe({
      next: (data) => {
        this.prediccionesIA = data;
        this.loadingIA = false;
      },
      error: (err) => {
        this.loadingIA = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener las predicciones de la IA.',
          icon: 'error'
        });
      }
    });
  }

  cerrarModalIA() {
    this.mostrarModalIA = false;
    this.prediccionesIA = [];
  }
  filtrarProductos() {

    let filtrados = this.productos;

    if (this.categoriaSeleccionada !== 'Todas las categorías') {
      filtrados = filtrados.filter(p =>
        p.categoria?.nombreCategoria.trim().toLowerCase() ===
        this.categoriaSeleccionada.trim().toLowerCase()
      );
    }

    if (this.busqueda.trim() !== '') {
      filtrados = filtrados.filter(p =>
        p.nombreProducto?.toLowerCase().includes(this.busqueda.trim().toLowerCase())
      );
    }

    if (this.estado === 'activo') {
      filtrados = filtrados.filter(p => p.cantidadProducto! > 10);
    } else if (this.estado === 'stock bajo') {
      filtrados = filtrados.filter(p => p.cantidadProducto! > 0 && p.cantidadProducto! <= 10);
    } else if (this.estado === 'sin stock') {
      filtrados = filtrados.filter(p => p.cantidadProducto! === 0);
    }

    this.totalUnidadesStockBajo = filtrados.filter(p => p.cantidadProducto! > 0 && p.cantidadProducto! < 10).length;
    this.totalUnidadesStockSin = filtrados.filter(p => p.cantidadProducto! === 0).length;
    this.unidadesEnAlmacen = filtrados.reduce((acum, p) => acum + (p.cantidadProducto ?? 0), 0);

    if (this.orden === 'nombre') {
      filtrados = filtrados.sort((a, b) => a.nombreProducto!.localeCompare(b.nombreProducto!));
    } else if (this.orden === 'stock') {
      filtrados = filtrados.sort((a, b) => (a.cantidadProducto ?? 0) - (b.cantidadProducto ?? 0));
    } else if (this.orden === 'precio') {
      filtrados = filtrados.sort((a, b) => (a.precioProducto ?? 0) - (b.precioProducto ?? 0));
    } else if (this.orden === 'id') {
      filtrados = filtrados.sort((a, b) => (a.idProducto ?? 0) - (b.idProducto ?? 0));
    }

    this.productosFiltrados = filtrados;
  }

  limpiarFiltros() {
    this.categoriaSeleccionada = 'Todas las categorías';
    this.busqueda = '';
    this.estado = 'Todos';
    this.orden = 'id';
    this.filtrarProductos();
  }

  abrirModal(producto: productosResponse, modo: 'ver' | 'editar' = 'ver') {
    this.productoSeleccionado = producto;
    this.modoEdicion = modo === 'editar';
    this.mostrarModal = true;
    this.stockNuevo = producto.cantidadProducto!;
    this.stockAnterior = producto.cantidadProducto!;
    if(this.stockAnterior != this.stockNuevo){
      this.cambioStock = true;
    }
    else{
      this.cambioStock = false;
    }
  }

  cerrarModal() {
    this.razonDeCambio = '';
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }
  guardarCambios() {
    if(!this.compararStock()){
      Swal.fire({
        title: 'Error',
        text: 'No hay cambios en el stock',
        icon: 'error',
      })
      return;
    }
    if(this.razonDeCambio.trim() === ''){
      Swal.fire({
        title: 'Error',
        text: 'Debe ingresar una razón de cambio de stock',
        icon: 'error',
      })
      return;
    }
    this.productoSeleccionado!.cantidadProducto = this.stockNuevo;
    var trabajador: Trabajador = {
      idTrabajador: parseInt(localStorage.getItem('idTrabajador')!),
      tipoTrabajador: null,
      nombreTrabajador: null,
      apellidoTrabajador: null,
      usuarioTrabajador: null,
      contraseñaTrabajador: null,
      estadoTrabajador: null
    }
    var auditoria: AuditoriaBody = {
      producto: this.productoSeleccionado!,
      accion: 'UPDATE',
      cantidadAnterior: this.stockAnterior,
      cantidadNueva: this.stockNuevo,
      trabajador: trabajador,
      referencia: this.razonDeCambio
    }
    this.productosService.actualizarProducto(this.productoSeleccionado!).subscribe(()=>{
      this.ventaService.crearAuditoria(auditoria).subscribe(() =>{
        this.cerrarModal();
        this.ngOnInit();
        Swal.fire({
          title: 'Cambio de stock realizado',
          icon: 'success'
        })
      })
    })
  }

  compararStock(){
    return this.stockAnterior != this.stockNuevo;
  }

}
