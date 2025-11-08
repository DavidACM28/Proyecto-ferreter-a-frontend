import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Categorias } from '../../services/categorias';
import { categoriasResponse } from '../../modelos/categoriasResponse';
import { productosResponse } from '../../modelos/productosResponse';
import { Productos } from '../../services/productos';
import { RespuestaSinResultados } from '../../modelos/respuestaSinResultados';
import { RespuestaConDatos } from '../../modelos/respuestaDNIConDatos';
import { Externos } from '../../services/externos';
import { Trabajador } from '../../modelos/trabajador';
import { VentaBody } from '../../modelos/ventaBody';
import { Venta } from '../../services/venta';
import { DetalleBody } from '../../modelos/detalleBody';
import { AuditoriaBody } from '../../modelos/auditoriaBody';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, SweetAlert2Module]
})
export class VentasComponent implements OnInit {
  private categoriasService = inject(Categorias);
  private productosService = inject(Productos);
  private externosService = inject(Externos);
  private ventaService = inject(Venta);
  busqueda: string = '';
  categoriaSeleccionada: string = 'Todas las categorías';      
  subcategoriaSeleccionada: any = '';   
  categorias: categoriasResponse[] = [];
  productos: productosResponse[] = [];
  resultadosFiltrados: productosResponse[] = [];
  productosMasVendidos: productosResponse[] = [];
  carrito: Map<number, { producto: productosResponse, cantidad: number }> = new Map();
  router = inject(Router);
  // ----- Modal de confirmación de venta -----
  mostrarModal: boolean = false;
  paso: number = 1;

  tipoComprobante: 'Boleta simple' | 'Boleta con cliente' | 'Factura' = 'Boleta simple';
  metodoPago: string = 'efectivo';

  // ----- Datos del cliente -----
  dniCliente: string = '';
  nombreCliente: string = 'Clientes varios';
  rucCliente: string = '';
  razonSocial: string = ''



  constructor(){
    const data = localStorage.getItem('carrito');
    if(data){
      const entries: [number, { producto: productosResponse, cantidad: number }][] = JSON.parse(data); this.carrito = new Map(entries);
    }
  }

  ngOnInit(): void {
    this.categoriasService.obtenerCategorias().subscribe((res) => {
      this.categorias = res;
    },
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('idTrabajador');
        this.router.navigate(['login']);
      }
    );

    this.productosService.obtenerProductos().subscribe((res) => {
      this.productos = res;
    });

    this.productosService.obtenerMasVendidos().subscribe((res) => {
      this.productosMasVendidos = res;
    });
  }
  
  aplicarFiltros(busqueda: String, categoria: String): void {
  const busquedaLimpia = busqueda.trim().toLowerCase();
  const categoriaLimpia = categoria.trim().toLowerCase();

  if (!busquedaLimpia && categoriaLimpia === "todas las categorías") {
    this.resultadosFiltrados = [];
    return;
  }

  this.resultadosFiltrados = this.productos.filter(p => {
    const nombreCoincide = p.nombreProducto!.toLowerCase().includes(busquedaLimpia);
    const categoriaCoincide = p.categoria!.nombreCategoria.toLowerCase() === categoriaLimpia;

    // Si se proporciona solo categoría
    if (!busquedaLimpia && categoriaLimpia !== "todas las categorías") {
      return categoriaCoincide;
    }

    // Si se proporciona solo búsqueda
    if (busquedaLimpia && categoriaLimpia === "todas las categorías") {
      return nombreCoincide;
    }

    // Si se proporciona búsqueda y categoría
    return nombreCoincide && categoriaCoincide;
    });
  }

  anadirProducto(prod: productosResponse): void {
    const item = this.carrito.get(prod.idProducto);
    if (item && item.cantidad == prod.cantidadProducto){
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se puede superar el stock de este producto.",
      });
      return;
    } 
    if (item) {
      item.cantidad++;
    } else {
      this.carrito.set(prod.idProducto, { producto: prod, cantidad: 1 });
    }
    this.guardarCarrito();
  }
  
  get itemsCarrito(): { producto: productosResponse, cantidad: number }[] {
    return Array.from(this.carrito.values());
  }

  guardarCarrito(){
    const data = Array.from(this.carrito.entries());
    localStorage.setItem('carrito', JSON.stringify(data));
  }

  get total(): number {
    let total = 0;
    this.carrito.forEach((item) => {
      total += item.cantidad * item.producto.precioProducto!;
    });
    return total;
  }

  incrementarCantidad(prod:productosResponse): void {
    const item = this.carrito.get(prod.idProducto)!;
    if (item.cantidad == prod.cantidadProducto){
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se puede superar el stock de este producto.",
      });
      return;
    }
    item.cantidad++
    this.guardarCarrito();
  }

  decrementarCantidad(prod:productosResponse): void {
    const item = this.carrito.get(prod.idProducto)!;
    if (item.cantidad == 1){
      this.carrito.delete(prod.idProducto);
      this.guardarCarrito();
      return;
    }
    item.cantidad--
    this.guardarCarrito();
  }

  eliminarProducto(prod:productosResponse): void {
    this.carrito.delete(prod.idProducto);
    this.guardarCarrito();
  }

  irARegistros(): void {
    this.router.navigateByUrl('/registros-ventas');
  }

  abrirModal(): void {
    if(this.carrito.size > 0){
      this.tipoComprobante = 'Boleta simple';
      this.mostrarModal = true;
      this.paso = 1;
      this.dniCliente = '';
      this.nombreCliente = 'Clientes varios';
      this.rucCliente = '';
      this.razonSocial = '';
    }
    else{
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay productos en el carrito",
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  esRespuestaSinResultados(res: any): res is RespuestaSinResultados {
    return res && res.success === false && typeof res.message === 'string';
  }

  esRespuestaDNIConDatos(res: any): res is RespuestaConDatos {
    return res &&
          typeof res.success === 'boolean' &&
          typeof res.dni === 'string' &&  
          typeof res.nombres === 'string' &&
          typeof res.apellidoPaterno === 'string' &&
          typeof res.apellidoMaterno === 'string' &&
          typeof res.codVerifica === 'number' &&
          typeof res.codVerificaLetra === 'string';
  }

  esRespuestaRuc(res: any): res is RespuestaRucConDatos {
    return res && typeof res.ruc === 'string' && typeof res.razonSocial === 'string';
  }

  // ----- Simulación de búsqueda -----
  buscarClientePorDNI(): void {
    if (this.dniCliente.length !== 8 || !/^\d{8}$/.test(this.dniCliente)) {
      Swal.fire({
        icon: "error",
        title: "Error en el DNI",
        text: "Ingresa un DNI válido (solo 8 números).",
      });
      return;
    }
    this.externosService.obtenerDNI(this.dniCliente).subscribe(response => {
    if (this.esRespuestaDNIConDatos(response)) {
      this.nombreCliente = response.nombres + ' ' + response.apellidoPaterno + ' ' + response.apellidoMaterno;
    } else if (this.esRespuestaSinResultados(response)) {
      this.nombreCliente = 'No se encontró el DNI';
    } else {
      console.error('Formato de respuesta no reconocido', response);
    }
    }, error => {
      console.error('Error en la petición', error);
    });
  }

  buscarClientePorRUC(): void {
    if (this.rucCliente.length !== 11 || !/^\d{11}$/.test(this.rucCliente)) {
      Swal.fire({
        icon: "error",
        title: "Error en el DNI",
        text: "Ingresa un RUC válido (solo 11 números).",
      });
      return;
    }
    this.externosService.obtenerRUC(this.rucCliente).subscribe(response => {
    if (this.esRespuestaRuc(response)) {
      this.razonSocial = response.razonSocial;
    } else if (this.esRespuestaSinResultados(response)) {
      this.nombreCliente = 'No se encontró el RUC';
    } else {
      console.error('Formato de respuesta no reconocido', response);
    }
    }, error => {
      console.error('Error en la petición', error);
    });
  }

  volverPaso1(){
    this.razonSocial = '';
    this.nombreCliente = 'Clientes varios';
    this.dniCliente = '';
    this.rucCliente = '';
    this.paso = 1;
  }

  irPaso2(){
    if(this.tipoComprobante != 'Boleta simple'){
      this.nombreCliente = '';
      this.paso = 2;
    }
    this.paso = 2;
  }

  validarPaso2(): void {
    if (this.tipoComprobante === 'Boleta simple') {
      this.paso = 3;
      return;
    }

    if (this.tipoComprobante === 'Boleta con cliente') {
      if (!this.nombreCliente || this.nombreCliente.trim() === '' || this.nombreCliente === 'No se encontró el DNI') {
        Swal.fire({
        icon: "error",
        title: "Error en el cliente",
        text: "Debes buscar y seleccionar un cliente válido antes de continuar.",
      });
        return;
      }
    }

    if (this.tipoComprobante === 'Factura') {
      if (!this.razonSocial || this.razonSocial.trim() === '' || this.razonSocial === 'No se encontró el RUC') {
        Swal.fire({
        icon: "error",
        title: "Error en el cliente",
        text: "Debes buscar y seleccionar un cliente válido antes de continuar.",
      });
      }
    }

    this.paso = 3;
  }

  onDniChange(): void {
    this.nombreCliente = '';
  }

  onRucChange(): void {
    this.razonSocial = '';
  }

  confirmarVenta(): void {
    var trabajador: Trabajador = {
      idTrabajador: parseInt(localStorage.getItem('idTrabajador')!),
      tipoTrabajador: null,
      nombreTrabajador: null,
      apellidoTrabajador: null,
      usuarioTrabajador: null,
      contraseñaTrabajador: null,
      estadoTrabajador: null
    }
    var venta: VentaBody = {
      trabajador: trabajador,
      totalVenta: this.total,
      clienteVenta: this.nombreCliente || this.razonSocial,
      medioPagoVenta: this.metodoPago
    }
    this.ventaService.crearVenta(venta).subscribe(res => {
      this.carrito.forEach((item) => {
        var detalle: DetalleBody = {
          producto: item.producto,
          venta: res,
          cantidadProducto: item.cantidad,
          precioProducto: item.producto.precioProducto!
        }
        this.ventaService.crearDetalleVenta(detalle).subscribe(() => {
          var auditoria: AuditoriaBody = {
            producto: item.producto,
            accion: 'UPDATE',
            cantidadAnterior: item.producto.cantidadProducto!,
            cantidadNueva: item.producto.cantidadProducto! - item.cantidad,
            trabajador: trabajador,
            referencia: 'Venta'
          }
          this.ventaService.crearAuditoria(auditoria).subscribe();
          item.producto.cantidadProducto = item.producto.cantidadProducto! - item.cantidad;
          this.productosService.actualizarProducto(item.producto).subscribe();
        })
      })
      this.ngOnInit();
      this.carrito.clear();
      this.mostrarModal = false;
      localStorage.removeItem('carrito');
      Swal.fire({
        title: "Venta realizada con éxito",
        icon: "success"
      });
    })
    
  }

}


