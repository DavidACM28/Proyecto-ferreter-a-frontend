import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoModalComponent } from '../producto-modal.component';
import { productosResponse } from '../../../modelos/productosResponse';
import { Productos } from '../../../services/productos';
import { Categorias } from '../../../services/categorias';
import { categoriasResponse } from '../../../modelos/categoriasResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductoModalComponent // <- obligatorio para usar <app-producto-modal>
  ],
  templateUrl: './productos.html',
  styleUrls: ['./productos.scss']
})
export class ProductosComponent implements OnInit {

  productoService = inject(Productos);
  categoriasService = inject(Categorias);
  productos: productosResponse[] = [];
  categorias: categoriasResponse[] = [];
  productosFiltrados: productosResponse[] = [];
  categoriaSeleccionada = 'Todos';
  busqueda = '';
  total = 0;
  tipo = false;

  mostrarModal = false;
  productoEditar?: productosResponse | null;

  constructor() { }

  ngOnInit(): void {
    this.categoriaSeleccionada = 'Todos'
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data;
      this.total = data.length;
    });

    this.categoriasService.obtenerCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  // 🔍 Filtrado general
  filtrarProductos() {
    if (this.categoriaSeleccionada === 'Todos' && this.busqueda === '') {
      this.productosFiltrados = this.productos;
      this.total = this.productosFiltrados.length;
      return;
    }

    const criterioCat = this.categoriaSeleccionada;
    const termino = this.busqueda.trim().toLowerCase();

    this.productosFiltrados = this.productos.filter(p => {
      const pasaCategoria = (criterioCat === 'Todos') || (p.categoria?.nombreCategoria === criterioCat);
      const pasaBusqueda = termino === ''
        || p.nombreProducto!.toLowerCase().includes(termino)
      return pasaCategoria && pasaBusqueda;
    });

    this.total = this.productosFiltrados.length;
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.filtrarProductos();
  }

  buscarProducto() {
    this.filtrarProductos();
  }

  // 🧩 Modal
  editarProducto(producto: productosResponse) {
    this.productoEditar = producto;
    this.mostrarModal = true;
    this.tipo = true;
  }

  nuevoProducto() {
    this.mostrarModal = true;
    this.tipo = true;
  }

  nuevaCategoria() {
    this.mostrarModal = true;
    this.tipo = false;
  }

  guardarProducto() {
    this.ngOnInit();
    Swal.fire({
      title: 'Producto guardado',
      text: 'Producto actualizado con éxito',
      icon: 'success',
    })
    this.productoEditar = null;
    this.mostrarModal = false;
  }

  crearProducto() {
    this.ngOnInit();
    Swal.fire({
      title: 'Producto creado',
      text: 'Producto creado con éxito',
      icon: 'success',
    })
    this.mostrarModal = false;
  }
  crearCategoria() {
    this.ngOnInit();
    Swal.fire({
      title: 'Categoria creada',
      text: 'Categoria creada con éxito',
      icon: 'success',
    })
    this.mostrarModal = false;
  }

  eliminarProducto(codigo: string) {
    this.mostrarModal = false;
    Swal.fire({
      title: 'Producto Deshabilitado',
      text: 'Producto deshabilitado con éxito',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    })
    this.ngOnInit();
  }

  cancelarModal() {
    this.productoEditar = null;
    this.mostrarModal = false;
  }
}
