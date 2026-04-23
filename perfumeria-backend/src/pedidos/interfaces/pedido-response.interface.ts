export interface PedidoResponse {
  id: number;
  usuarioId: number;
  nroPedido: string;
  tipoEntrega: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  estado: string;
  fechaCreacion: Date;
  observaciones: string | null;
  telefonoContacto: string | null;
  direccionEnvio: string | null;
  ciudadEnvio: string | null;
  provinciaEnvio: string | null;
  codigoPostalEnvio: string | null;
  items: ItemPedidoResponse[];
}

export interface ItemPedidoResponse {
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
