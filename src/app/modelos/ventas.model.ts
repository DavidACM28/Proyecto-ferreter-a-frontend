// Producto en carrito
export interface ItemCarrito {
    codigo: string;
    nombre: string;
    precio: number;
    stock: number;
    cantidad: number;
}

// Cliente
export interface Cliente {
    nombre: string;
    dni?: string;
    ruc?: string;
    telefono?: string;
    correo?: string;
}

// Vendedor
export interface Vendedor {
    id: string;
    nombre: string;
    sucursal?: string;
}

export interface RegistroVenta {
    idVenta: string;
    fecha: Date;
    cliente: Cliente;
    vendedor: Vendedor;
    tipoComprobante: 'boleta' | 'factura' | 'venta';
    productos: ItemCarrito[];
    metodoPago: string;
    subtotal: number;
    igv: number;
    total: number;
    estado: 'Completada' | 'Pendiente' | 'Anulada';
}

