import axios from "axios";
import type {
  Marca,
  Categoria,
  Perfume,
  ProductoFiltros,
  Carrito,
  Pedido,
  Showroom,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AgregarCarritoRequest,
  CrearPedidoRequest,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getMarcas(): Promise<Marca[]> {
  return api.get("/marcas").then((r) => r.data);
}

export function getCategoria(): Promise<Categoria[]> {
  return api.get("/categorias").then((r) => r.data);
}

export function getPerfumes(filters?: ProductoFiltros): Promise<Perfume[]> {
  return api.get("/productos", { params: filters }).then((r) => r.data);
}

export function getPerfume(id: number): Promise<Perfume> {
  return api.get(`/productos/${id}`).then((r) => r.data);
}

export function getShowroom(): Promise<Showroom> {
  return api.get("/showroom").then((r) => r.data);
}

export function login(data: LoginRequest): Promise<AuthResponse> {
  return api.post("/auth/login", data).then((r) => r.data);
}

export function register(data: RegisterRequest): Promise<AuthResponse> {
  return api.post("/auth/register", data).then((r) => r.data);
}

export function getCarrito(): Promise<Carrito> {
  return api.get("/carrito").then((r) => r.data);
}

export function agregarAlCarrito(
  data: AgregarCarritoRequest,
): Promise<Carrito> {
  return api.post("/carrito/items", data).then((r) => r.data);
}

export function actualizarItemCarrito(
  varianteId: number,
  cantidad: number,
): Promise<Carrito> {
  return api
    .patch(`/carrito/items/${varianteId}`, { cantidad })
    .then((r) => r.data);
}

export function quitarDelCarrito(varianteId: number): Promise<void> {
  return api.delete(`/carrito/items/${varianteId}`).then((r) => r.data);
}

export function vaciarCarrito(): Promise<void> {
  return api.delete("/carrito").then((r) => r.data);
}

export function getPedidos(): Promise<Pedido[]> {
  return api.get("/pedidos").then((r) => r.data);
}

export function getPedido(id: number): Promise<Pedido> {
  return api.get(`/pedidos/${id}`).then((r) => r.data);
}

export function crearPedido(data: CrearPedidoRequest): Promise<Pedido> {
  return api.post("/pedidos", data).then((r) => r.data);
}
