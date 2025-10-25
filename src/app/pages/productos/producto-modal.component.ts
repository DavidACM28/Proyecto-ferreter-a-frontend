import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { productosResponse } from '../../modelos/productosResponse';
import { categoriasResponse } from '../../modelos/categoriasResponse';
import { Categorias } from '../../services/categorias';
import { Productos } from '../../services/productos';
import { Venta } from '../../services/venta';
import Swal from 'sweetalert2';
import { AuditoriaBody } from '../../modelos/auditoriaBody';
import { Trabajador } from '../../modelos/trabajador';
import { productoBody } from '../../modelos/productoBody';
import { categoriaBody } from '../../modelos/categoriaBody';


@Component({
    selector: 'app-producto-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './producto-modal.component.html',
})
export class ProductoModalComponent {
    @Input() producto?: productosResponse | null;
    @Input() tipo: boolean = false;
    @Output() onGuardar = new EventEmitter<void>();
    @Output() onCancelar = new EventEmitter<void>();
    @Output() onEliminar = new EventEmitter<string>();
    @Output() onCrear = new EventEmitter<void>();
    @Output() onCrearCategoria = new EventEmitter<void>();

    categoriaService = inject(Categorias);
    productosService = inject(Productos);
    ventasService = inject(Venta);
    categorias: categoriasResponse[] = [];
    codigo = 0;
    descripcion = '';
    nombre = '';
    categoria = '';
    precio = 0;
    stock = 0;
    stockAnterior = 0;
    estado = true;
    razonCambioStock = '';
    nombreCategoria = '';

    ngOnInit() {
        if (this.producto != null) {
            this.codigo = this.producto.idProducto;
            this.nombre = this.producto.nombreProducto!;
            this.categoria = this.producto.categoria!.nombreCategoria;
            this.precio = this.producto.precioProducto!;
            this.stock = this.producto.cantidadProducto!;
            this.stockAnterior = this.producto.cantidadProducto!;
            this.descripcion = this.producto.descripcionProducto!;
            this.estado = this.producto.estadoProducto!;
        }
        this.categoriaService.obtenerCategorias().subscribe(res => {
            this.categorias = res;
        });
    }

    guardarProducto() {
        var categoria: categoriasResponse = this.categorias.find(c => c.nombreCategoria === this.categoria)!;
        var producto: productosResponse = {
            idProducto: this.codigo,
            nombreProducto: this.nombre,
            categoria: categoria,
            precioProducto: this.precio,
            cantidadProducto: this.stock,
            descripcionProducto: this.descripcion,
            estadoProducto: this.estado
        };
        if (this.compararStock()) {
            if (this.razonCambioStock.trim() === '') {
                Swal.fire({
                    title: 'Error',
                    text: 'Debe ingresar una razón de cambio de stock',
                    icon: 'error',
                })
                return;
            }

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
                producto: producto,
                accion: 'UPDATE',
                cantidadAnterior: this.stockAnterior,
                cantidadNueva: this.stock,
                trabajador: trabajador,
                referencia: this.razonCambioStock
            }

            this.producto = producto;
            this.productosService.actualizarProducto(producto).subscribe(() => {
                this.ventasService.crearAuditoria(auditoria).subscribe(() => {
                    this.onGuardar.emit();
                });
            });
        }
        else {
            this.producto = producto;
            this.productosService.actualizarProducto(producto).subscribe(() => {
                this.onGuardar.emit();
            });
        }
    }

    agregarProducto() {
        var categoria: categoriasResponse = this.categorias.find(c => c.nombreCategoria === this.categoria)!;
        var trabajador: Trabajador = {
            idTrabajador: parseInt(localStorage.getItem('idTrabajador')!),
            tipoTrabajador: null,
            nombreTrabajador: null,
            apellidoTrabajador: null,
            usuarioTrabajador: null,
            contraseñaTrabajador: null,
            estadoTrabajador: null
        }
        var producto: productoBody = {
            categoria: categoria,
            nombreProducto: this.nombre,
            descripcionProducto: this.descripcion,
            precioProducto: this.precio,
            cantidadProducto: this.stock,
            estadoProducto: true
        };
        this.productosService.nuevoProducto(producto).subscribe(res => {
            var auditoria: AuditoriaBody = {
                producto: res,
                accion: 'INSERT',
                cantidadAnterior: 0,
                cantidadNueva: this.stock,
                trabajador: trabajador,
                referencia: 'Nuevo producto'
            }
            this.ventasService.crearAuditoria(auditoria).subscribe(() => {
                this.onCrear.emit();
            });
        });
    }

    cancelar() {
        this.producto = null;
        this.onCancelar.emit();
    }

    eliminarProducto() {
        this.productosService.deshabilitarProducto(this.producto!.idProducto).subscribe(() => {
            this.producto = null;
            this.onEliminar.emit();
        });
    }
    compararCategoria(c1: string, c2: string): boolean {
        return c1 === c2;
    }

    compararStock(): boolean {
        if (!this.producto) {
            return false;
        }
        return this.stock != this.stockAnterior;
    }
    agregarCategoria() {
        var categoria: categoriaBody = {
            nombreCategoria: this.nombreCategoria,
            estadoCategoria: true
        };
        this.categoriaService.nueveaCategoria(categoria).subscribe(() => {
            this.onCrearCategoria.emit();
        });
    }
}
