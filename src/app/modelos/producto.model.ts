export interface Producto {
    codigo: string;
    nombre: string;
    precio: number;
    stock: number;
    categoria: string;
    subcategoria?: string;
}

export interface Categoria {
    nombre: string;
    subcategorias: string[];
}

