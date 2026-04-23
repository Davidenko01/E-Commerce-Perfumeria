export interface CarritoResponse {
  id: number;
  usuarioId: number;
  estado: string;
  creadoAt: Date;
  items: ItemCarritoResponse[];
}

export interface ItemCarritoResponse {
  varianteId: number;
  cantidad: number;
  precioUnitario: number;
  variante: {
    id: number;
    volumen: number;
    precio: number;
    perfume: {
      id: number;
      nombre: string;
      imagenUrl: string | null;
      marca: {
        nombre: string;
      };
    };
  };
}
