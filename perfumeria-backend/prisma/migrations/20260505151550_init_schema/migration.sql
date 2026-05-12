-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('HOMBRE', 'MUJER', 'UNISEX');

-- CreateEnum
CREATE TYPE "Concentracion" AS ENUM ('EF', 'EDC', 'EDT', 'EDP', 'PARFUM', 'ELIXIR');

-- CreateEnum
CREATE TYPE "EstadoCarrito" AS ENUM ('ACTIVO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO_RETIRO', 'DESPACHADO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoStock" AS ENUM ('VENTA', 'DEVOLUCION', 'INGRESO_MANUAL', 'EGRESO_MANUAL', 'AJUSTE');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('ENVIO', 'RETIRO');

-- CreateEnum
CREATE TYPE "TipoMetodoPago" AS ENUM ('TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA_BANCARIA', 'EFECTIVO', 'BILLETERA_VIRTUAL', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoNota" AS ENUM ('SALIDA', 'CORAZON', 'FONDO');

-- CreateEnum
CREATE TYPE "TipoDescuento" AS ENUM ('PORCENTAJE', 'MONTO_FIJO');

-- CreateEnum
CREATE TYPE "EstadoResena" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "telefono" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "cod_postal" TEXT NOT NULL,
    "notas" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "pais_origen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "logo_url" TEXT,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfumes" (
    "id" SERIAL NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "concentracion" "Concentracion",
    "genero" "Genero" NOT NULL,
    "familia_olfativa_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "imagen_url" TEXT NOT NULL,
    "galeria_imagenes" TEXT[],
    "slug" TEXT NOT NULL,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familias_olfativas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "familias_olfativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_notas" (
    "perfumeId" INTEGER NOT NULL,
    "notaId" INTEGER NOT NULL,
    "tipoNota" "TipoNota" NOT NULL,

    CONSTRAINT "perfume_notas_pkey" PRIMARY KEY ("perfumeId","notaId","tipoNota")
);

-- CreateTable
CREATE TABLE "notas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "slug" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variantes_perfume" (
    "id" SERIAL NOT NULL,
    "perfume_id" INTEGER NOT NULL,
    "volumen" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "precio_comparativo" DECIMAL(10,2),
    "etiqueta_descuento" TEXT,
    "inicio_descuento" TIMESTAMP(3),
    "fin_descuento" TIMESTAMP(3),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "variantes_perfume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "estado" "EstadoCarrito" NOT NULL DEFAULT 'ACTIVO',
    "creado_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_carrito" (
    "carrito_id" INTEGER NOT NULL,
    "variante_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "items_carrito_pkey" PRIMARY KEY ("carrito_id","variante_id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nro_pedido" TEXT NOT NULL,
    "cupon_id" INTEGER,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "tipo_entrega" "TipoEntrega" NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "costo_envio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_descuentado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "observaciones" TEXT,
    "cancelacion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telefono_contacto" TEXT,
    "direccion_envio" TEXT,
    "ciudad_envio" TEXT,
    "provincia_envio" TEXT,
    "codigo_postal_envio" TEXT,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_pedido" (
    "pedido_id" INTEGER NOT NULL,
    "variante_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "volumen" INTEGER NOT NULL,
    "precio_anterior" DECIMAL(10,2),
    "etiqueta_descuento" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "items_pedido_pkey" PRIMARY KEY ("pedido_id","variante_id")
);

-- CreateTable
CREATE TABLE "metodos_pago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoMetodoPago" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "metodo_pago_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "cuotas" INTEGER NOT NULL DEFAULT 1,
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "external_id" TEXT,
    "external_status" TEXT,
    "payment_type" TEXT,
    "monto_reembolso" DECIMAL(10,2),
    "fecha_reembolso" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos_eventos" (
    "id" SERIAL NOT NULL,
    "pago_id" INTEGER NOT NULL,
    "estado_anterior" "EstadoPago",
    "estado_nuevo" "EstadoPago" NOT NULL,
    "origen" TEXT NOT NULL,
    "payload" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupones" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo_descuento" "TipoDescuento" NOT NULL,
    "monto_descuento" DECIMAL(10,2) NOT NULL,
    "monto_minimo_compra" DECIMAL(10,2),
    "max_cant_usos" INTEGER,
    "cant_usos" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "expira" TIMESTAMP(3),
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cupones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usos_cupon" (
    "id" SERIAL NOT NULL,
    "cupon_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usos_cupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_stock" (
    "id" SERIAL NOT NULL,
    "variante_id" INTEGER NOT NULL,
    "pedido_id" INTEGER,
    "tipo_movimiento" "TipoMovimientoStock" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stock_anterior" INTEGER NOT NULL,
    "stock_posterior" INTEGER NOT NULL,
    "motivo" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" SERIAL NOT NULL,
    "perfume_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "titulo" VARCHAR(100),
    "comentario" TEXT,
    "ventajas" TEXT,
    "desventajas" TEXT,
    "estado" "EstadoResena" NOT NULL DEFAULT 'PENDIENTE',
    "likes" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "fecha_compra" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "respuesta_admin" TEXT,
    "respuesta_fecha" TIMESTAMP(3),

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "direcciones_usuario_id_idx" ON "direcciones"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_slug_key" ON "marcas"("slug");

-- CreateIndex
CREATE INDEX "marcas_slug_idx" ON "marcas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_slug_key" ON "perfumes"("slug");

-- CreateIndex
CREATE INDEX "perfumes_slug_idx" ON "perfumes"("slug");

-- CreateIndex
CREATE INDEX "perfumes_categoria_id_idx" ON "perfumes"("categoria_id");

-- CreateIndex
CREATE INDEX "perfumes_marca_id_idx" ON "perfumes"("marca_id");

-- CreateIndex
CREATE INDEX "perfumes_genero_idx" ON "perfumes"("genero");

-- CreateIndex
CREATE INDEX "perfumes_destacado_idx" ON "perfumes"("destacado");

-- CreateIndex
CREATE INDEX "perfumes_activo_idx" ON "perfumes"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "familias_olfativas_nombre_key" ON "familias_olfativas"("nombre");

-- CreateIndex
CREATE INDEX "perfume_notas_notaId_idx" ON "perfume_notas"("notaId");

-- CreateIndex
CREATE INDEX "perfume_notas_tipoNota_idx" ON "perfume_notas"("tipoNota");

-- CreateIndex
CREATE UNIQUE INDEX "notas_nombre_key" ON "notas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_slug_idx" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_is_active_idx" ON "categorias"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "variantes_perfume_sku_key" ON "variantes_perfume"("sku");

-- CreateIndex
CREATE INDEX "variantes_perfume_perfume_id_activo_idx" ON "variantes_perfume"("perfume_id", "activo");

-- CreateIndex
CREATE INDEX "variantes_perfume_activo_stock_idx" ON "variantes_perfume"("activo", "stock");

-- CreateIndex
CREATE INDEX "variantes_perfume_sku_idx" ON "variantes_perfume"("sku");

-- CreateIndex
CREATE INDEX "variantes_perfume_precio_idx" ON "variantes_perfume"("precio");

-- CreateIndex
CREATE UNIQUE INDEX "carritos_usuario_id_key" ON "carritos"("usuario_id");

-- CreateIndex
CREATE INDEX "carritos_estado_idx" ON "carritos"("estado");

-- CreateIndex
CREATE INDEX "carritos_creado_at_idx" ON "carritos"("creado_at");

-- CreateIndex
CREATE INDEX "items_carrito_variante_id_idx" ON "items_carrito"("variante_id");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_nro_pedido_key" ON "pedidos"("nro_pedido");

-- CreateIndex
CREATE INDEX "pedidos_usuario_id_idx" ON "pedidos"("usuario_id");

-- CreateIndex
CREATE INDEX "pedidos_estado_idx" ON "pedidos"("estado");

-- CreateIndex
CREATE INDEX "pedidos_fecha_creacion_idx" ON "pedidos"("fecha_creacion");

-- CreateIndex
CREATE INDEX "pedidos_nro_pedido_idx" ON "pedidos"("nro_pedido");

-- CreateIndex
CREATE INDEX "items_pedido_pedido_id_idx" ON "items_pedido"("pedido_id");

-- CreateIndex
CREATE INDEX "items_pedido_variante_id_idx" ON "items_pedido"("variante_id");

-- CreateIndex
CREATE UNIQUE INDEX "metodos_pago_nombre_key" ON "metodos_pago"("nombre");

-- CreateIndex
CREATE INDEX "metodos_pago_activo_idx" ON "metodos_pago"("activo");

-- CreateIndex
CREATE INDEX "pagos_pedido_id_idx" ON "pagos"("pedido_id");

-- CreateIndex
CREATE INDEX "pagos_usuario_id_idx" ON "pagos"("usuario_id");

-- CreateIndex
CREATE INDEX "pagos_estado_idx" ON "pagos"("estado");

-- CreateIndex
CREATE INDEX "pagos_fecha_creacion_idx" ON "pagos"("fecha_creacion");

-- CreateIndex
CREATE INDEX "pagos_eventos_pago_id_idx" ON "pagos_eventos"("pago_id");

-- CreateIndex
CREATE INDEX "pagos_eventos_fecha_idx" ON "pagos_eventos"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "cupones_codigo_key" ON "cupones"("codigo");

-- CreateIndex
CREATE INDEX "cupones_codigo_idx" ON "cupones"("codigo");

-- CreateIndex
CREATE INDEX "cupones_activo_idx" ON "cupones"("activo");

-- CreateIndex
CREATE INDEX "cupones_expira_idx" ON "cupones"("expira");

-- CreateIndex
CREATE UNIQUE INDEX "usos_cupon_pedido_id_key" ON "usos_cupon"("pedido_id");

-- CreateIndex
CREATE INDEX "usos_cupon_cupon_id_idx" ON "usos_cupon"("cupon_id");

-- CreateIndex
CREATE INDEX "usos_cupon_usuario_id_idx" ON "usos_cupon"("usuario_id");

-- CreateIndex
CREATE INDEX "usos_cupon_usedAt_idx" ON "usos_cupon"("usedAt");

-- CreateIndex
CREATE UNIQUE INDEX "usos_cupon_cupon_id_usuario_id_key" ON "usos_cupon"("cupon_id", "usuario_id");

-- CreateIndex
CREATE INDEX "movimientos_stock_variante_id_idx" ON "movimientos_stock"("variante_id");

-- CreateIndex
CREATE INDEX "movimientos_stock_pedido_id_idx" ON "movimientos_stock"("pedido_id");

-- CreateIndex
CREATE INDEX "movimientos_stock_fecha_creacion_idx" ON "movimientos_stock"("fecha_creacion");

-- CreateIndex
CREATE INDEX "resenas_perfume_id_idx" ON "resenas"("perfume_id");

-- CreateIndex
CREATE INDEX "resenas_usuario_id_idx" ON "resenas"("usuario_id");

-- CreateIndex
CREATE INDEX "resenas_calificacion_idx" ON "resenas"("calificacion");

-- CreateIndex
CREATE INDEX "resenas_estado_idx" ON "resenas"("estado");

-- CreateIndex
CREATE INDEX "resenas_created_at_idx" ON "resenas"("created_at");

-- CreateIndex
CREATE INDEX "resenas_perfume_id_estado_visible_idx" ON "resenas"("perfume_id", "estado", "visible");

-- CreateIndex
CREATE INDEX "resenas_calificacion_created_at_idx" ON "resenas"("calificacion", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_perfume_id_usuario_id_pedido_id_key" ON "resenas"("perfume_id", "usuario_id", "pedido_id");

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfumes" ADD CONSTRAINT "perfumes_familia_olfativa_id_fkey" FOREIGN KEY ("familia_olfativa_id") REFERENCES "familias_olfativas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfumes" ADD CONSTRAINT "perfumes_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfumes" ADD CONSTRAINT "perfumes_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfume_notas" ADD CONSTRAINT "perfume_notas_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfume_notas" ADD CONSTRAINT "perfume_notas_notaId_fkey" FOREIGN KEY ("notaId") REFERENCES "notas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variantes_perfume" ADD CONSTRAINT "variantes_perfume_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_carrito" ADD CONSTRAINT "items_carrito_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_carrito" ADD CONSTRAINT "items_carrito_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes_perfume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes_perfume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_eventos" ADD CONSTRAINT "pagos_eventos_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pagos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usos_cupon" ADD CONSTRAINT "usos_cupon_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usos_cupon" ADD CONSTRAINT "usos_cupon_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usos_cupon" ADD CONSTRAINT "usos_cupon_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes_perfume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
