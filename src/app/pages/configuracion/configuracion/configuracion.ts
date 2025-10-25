import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Productos } from '../../../services/productos';
import { productosResponse } from '../../../modelos/productosResponse';
import Swal from 'sweetalert2';
import { categoriasResponse } from '../../../modelos/categoriasResponse';
import { Categorias } from '../../../services/categorias';
import { Trabajador } from '../../../modelos/trabajador';
import { TrabajadorService } from '../../../services/trabajador';
import { TipoTrabajador } from '../../../modelos/tipoTrabajador';
import { TipoTrabajadorService } from '../../../services/tipoTrabajador';
import { TrabajadorBody } from '../../../modelos/trabajadorBody';

@Component({
  selector: 'app-configuracion',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss'
})
export class ConfiguracionComponent implements OnInit {
  productoService = inject(Productos);
  categoriaService = inject(Categorias);
  trabajadorService = inject(TrabajadorService);
  tipoTrabajadorService = inject(TipoTrabajadorService);

  productos: productosResponse[] = [];
  categorias: categoriasResponse[] = [];
  trabajadores: Trabajador[] = [];
  tiposTrabajador: TipoTrabajador[] = [];

  // 🪟 Estado de los modales
  mostrarModalCrear = false;
  mostrarModalEditar = false;

  nombreTrabajador: string = '';
  apellidoTrabajador: string = '';
  usuarioTrabajador: string = '';
  contrasenaTrabajador: string = '';
  confirmarContrasena: string = '';
  tipoTrabajador: string = '';

  trabajadorEditar: Trabajador | null = null;
  

  ngOnInit(): void {
    this.mostrarModalCrear = false;
    this.mostrarModalEditar = false;
    this.productoService.obtenerProductosDeshabilitados().subscribe(res => {
      this.productos = res;
    });
    this.categoriaService.obtenerTodasCategorias().subscribe(res => {
      this.categorias = res;
    });
    this.trabajadorService.listarTrabajadores().subscribe(res => {
      this.trabajadores = res;
    });
    this.tipoTrabajadorService.listarTipos().subscribe(res => {
      this.tiposTrabajador = res;
    });
  }

  // 🪟 Funciones modales
  abrirModalCrear() {
    this.mostrarModalCrear = true;
    this.nombreTrabajador = '';
    this.apellidoTrabajador = '';
    this.usuarioTrabajador = '';
    this.contrasenaTrabajador = '';
    this.confirmarContrasena = '';
    this.tipoTrabajador = '';
    this.confirmarContrasena = '';
  }
  cerrarModalCrear() {
    this.mostrarModalCrear = false;
  }

  abrirModalEditar(trabajador: Trabajador) {
    this.trabajadorEditar = trabajador;
    this.mostrarModalEditar = true;
  }
  cerrarModalEditar() {
    this.contrasenaTrabajador = '';
    this.mostrarModalEditar = false;
  }
  crearTrabajador() {
    if (this.contrasenaTrabajador !== this.confirmarContrasena) {
      Swal.fire({
        title: 'Contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    var tipo: TipoTrabajador = {
      idTipoTrabajador: parseInt(this.tipoTrabajador),
      descripcionTipoTrabajador: ''
    }
    var trabajador: TrabajadorBody = {
      username: this.usuarioTrabajador,
      password: this.contrasenaTrabajador,
      nombre: this.nombreTrabajador,
      apellido: this.apellidoTrabajador,
      tipoTrabajador: tipo,
      estadoTrabajador: true
    };
    this.trabajadorService.nuevoTrabajador(trabajador).subscribe(res => {
      Swal.fire({
        title: 'Trabajador creado',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.ngOnInit();
    });
  }

  guardarTrabajador() {
    if(this.contrasenaTrabajador.trim() != ''){
      this.trabajadorEditar!.contraseñaTrabajador = this.contrasenaTrabajador;
    }
    this.trabajadorService.editarTrabajador(this.trabajadorEditar!).subscribe(res => {
      Swal.fire({
        title: 'Trabajador actualizado',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.ngOnInit();
      this.cerrarModalEditar();
    });
  }

  // 🔧 Funciones existentes
  habilitarProducto(idProducto: number) {
    this.productoService.habilitarProducto(idProducto).subscribe(() => {
      Swal.fire({
        title: 'Producto habilitado',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.ngOnInit();
    });
  }

  habilitarCategoria(idCategoria: number) {
    this.categoriaService.habilitarCategoria(idCategoria).subscribe(() => {
      Swal.fire({
        title: 'Categoria habilitada',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.ngOnInit();
    });
  }

  deshabilitarCategoria(idCategoria: number) {
    this.categoriaService.deshabilitarCategoria(idCategoria).subscribe(() => {
      Swal.fire({
        title: 'Categoria deshabilitada',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.ngOnInit();
    });
  }

  habilitarTrabajador(idTrabajador: number) {
    this.trabajadorService.habilitarTrabajador(idTrabajador).subscribe(() => {
      Swal.fire({
        title: 'Trabajador habilitado',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.ngOnInit();
    });
  }

  deshabilitarTrabajador(idTrabajador: number) {
    this.trabajadorService.deshabilitarTrabajador(idTrabajador).subscribe(() => {
      Swal.fire({
        title: 'Trabajador deshabilitado',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      this.ngOnInit();
    });
  }
}
