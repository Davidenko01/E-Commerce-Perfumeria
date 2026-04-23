export interface MarcaResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  paisOrigen: string | null;
  activo: boolean;
  logoUrl: string | null;
}
