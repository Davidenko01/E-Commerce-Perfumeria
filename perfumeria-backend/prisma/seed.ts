import { PrismaClient, Role, Genero, Concentracion, TipoMetodoPago } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

async function main() {
  console.log('🌱 Iniciando seeder...');

  // -------------------------------------------------------------------------
  // USUARIOS
  // -------------------------------------------------------------------------
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@perfumeria.com' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@perfumeria.com',
      passwordHash: adminHash,
      telefono: '+5492994000001',
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.usuario.upsert({
    where: { email: 'sol@perfumeria.com' },
    update: {},
    create: {
      nombre: 'Sol',
      apellido: 'Scotto',
      email: 'sol@perfumeria.com',
      passwordHash: userHash,
      telefono: '+5492994000002',
      role: Role.USER,
    },
  });

  const user2 = await prisma.usuario.upsert({
    where: { email: 'juan@perfumeria.com' },
    update: {},
    create: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@perfumeria.com',
      passwordHash: userHash,
      telefono: '+5492994000003',
      role: Role.USER,
    },
  });

  console.log('✅ Usuarios creados');

  // -------------------------------------------------------------------------
  // CATEGORÍAS
  // -------------------------------------------------------------------------
  const categorias = await Promise.all([
    prisma.categoria.upsert({
      where: { slug: 'florales' },
      update: {},
      create: { nombre: 'Florales', descripcion: 'Perfumes con notas florales', slug: 'florales' },
    }),
    prisma.categoria.upsert({
      where: { slug: 'orientales' },
      update: {},
      create: { nombre: 'Orientales', descripcion: 'Perfumes con notas orientales y especiadas', slug: 'orientales' },
    }),
    prisma.categoria.upsert({
      where: { slug: 'amaderados' },
      update: {},
      create: { nombre: 'Amaderados', descripcion: 'Perfumes con notas de madera', slug: 'amaderados' },
    }),
    prisma.categoria.upsert({
      where: { slug: 'citricos' },
      update: {},
      create: { nombre: 'Cítricos', descripcion: 'Perfumes frescos y cítricos', slug: 'citricos' },
    }),
    prisma.categoria.upsert({
      where: { slug: 'acuaticos' },
      update: {},
      create: { nombre: 'Acuáticos', descripcion: 'Perfumes con notas marinas y frescas', slug: 'acuaticos' },
    }),
  ]);

  console.log('✅ Categorías creadas');

  // -------------------------------------------------------------------------
  // MARCAS
  // -------------------------------------------------------------------------
  const marcas = await Promise.all([
    prisma.marca.upsert({
      where: { nombre: 'Chanel' },
      update: {},
      create: { nombre: 'Chanel', descripcion: 'Maison de moda y perfumería francesa', paisOrigen: 'Francia' },
    }),
    prisma.marca.upsert({
      where: { nombre: 'Dior' },
      update: {},
      create: { nombre: 'Dior', descripcion: 'Alta costura y perfumería de lujo', paisOrigen: 'Francia' },
    }),
    prisma.marca.upsert({
      where: { nombre: 'Versace' },
      update: {},
      create: { nombre: 'Versace', descripcion: 'Moda italiana de lujo', paisOrigen: 'Italia' },
    }),
    prisma.marca.upsert({
      where: { nombre: 'Calvin Klein' },
      update: {},
      create: { nombre: 'Calvin Klein', descripcion: 'Moda y fragancias americanas', paisOrigen: 'Estados Unidos' },
    }),
    prisma.marca.upsert({
      where: { nombre: 'Yves Saint Laurent' },
      update: {},
      create: { nombre: 'Yves Saint Laurent', descripcion: 'Alta moda y fragancias icónicas', paisOrigen: 'Francia' },
    }),
  ]);

  console.log('✅ Marcas creadas');

  // -------------------------------------------------------------------------
  // PERFUMES + VARIANTES
  // -------------------------------------------------------------------------
  const perfumesData = [
    {
      nombre: 'N°5',
      slug: 'chanel-n5',
      marcaIdx: 0,
      categoriaIdx: 0,
      concentracion: Concentracion.EDP,
      genero: Genero.MUJER,
      tipo: 'Floral Aldehídico',
      descripcion: 'El perfume más icónico del mundo, creado en 1921.',
      variantes: [
        { volumen: 30, precio: 85000, stock: 15, sku: 'CHA-N5-030' },
        { volumen: 50, precio: 125000, stock: 10, sku: 'CHA-N5-050' },
        { volumen: 100, precio: 175000, stock: 8, sku: 'CHA-N5-100' },
      ],
    },
    {
      nombre: 'Bleu de Chanel',
      slug: 'chanel-bleu',
      marcaIdx: 0,
      categoriaIdx: 2,
      concentracion: Concentracion.EDP,
      genero: Genero.HOMBRE,
      tipo: 'Aromático Maderado',
      descripcion: 'Una fragancia maderada y aromática para el hombre moderno.',
      variantes: [
        { volumen: 50, precio: 115000, stock: 12, sku: 'CHA-BLC-050' },
        { volumen: 100, precio: 160000, stock: 7, sku: 'CHA-BLC-100' },
      ],
    },
    {
      nombre: 'Sauvage',
      slug: 'dior-sauvage',
      marcaIdx: 1,
      categoriaIdx: 4,
      concentracion: Concentracion.EDT,
      genero: Genero.HOMBRE,
      tipo: 'Aromático Fresco',
      descripcion: 'Un perfume salvaje y noble inspirado en los cielos abiertos.',
      variantes: [
        { volumen: 60, precio: 98000, stock: 20, sku: 'DIO-SAU-060' },
        { volumen: 100, precio: 135000, stock: 14, sku: 'DIO-SAU-100' },
        { volumen: 200, precio: 185000, stock: 5, sku: 'DIO-SAU-200' },
      ],
    },
    {
      nombre: 'Miss Dior',
      slug: 'dior-miss-dior',
      marcaIdx: 1,
      categoriaIdx: 0,
      concentracion: Concentracion.EDP,
      genero: Genero.MUJER,
      tipo: 'Floral Fresco',
      descripcion: 'Una declaración de amor en forma de fragancia floral.',
      variantes: [
        { volumen: 30, precio: 78000, stock: 10, sku: 'DIO-MIS-030' },
        { volumen: 50, precio: 110000, stock: 8, sku: 'DIO-MIS-050' },
        { volumen: 100, precio: 155000, stock: 6, sku: 'DIO-MIS-100' },
      ],
    },
    {
      nombre: 'Eros',
      slug: 'versace-eros',
      marcaIdx: 2,
      categoriaIdx: 2,
      concentracion: Concentracion.EDT,
      genero: Genero.HOMBRE,
      tipo: 'Oriental Fougère',
      descripcion: 'Inspirado en el dios griego del amor. Intenso y sensual.',
      variantes: [
        { volumen: 30, precio: 55000, stock: 18, sku: 'VER-ERO-030' },
        { volumen: 50, precio: 75000, stock: 12, sku: 'VER-ERO-050' },
        { volumen: 100, precio: 105000, stock: 9, sku: 'VER-ERO-100' },
      ],
    },
    {
      nombre: 'CK One',
      slug: 'ck-one',
      marcaIdx: 3,
      categoriaIdx: 3,
      concentracion: Concentracion.EDT,
      genero: Genero.UNISEX,
      tipo: 'Cítrico Floral',
      descripcion: 'La fragancia unisex que redefinió la perfumería en los 90.',
      variantes: [
        { volumen: 50, precio: 42000, stock: 25, sku: 'CKL-ONE-050' },
        { volumen: 100, precio: 60000, stock: 20, sku: 'CKL-ONE-100' },
        { volumen: 200, precio: 85000, stock: 10, sku: 'CKL-ONE-200' },
      ],
    },
    {
      nombre: 'Black Opium',
      slug: 'ysl-black-opium',
      marcaIdx: 4,
      categoriaIdx: 1,
      concentracion: Concentracion.EDP,
      genero: Genero.MUJER,
      tipo: 'Oriental Gourmand',
      descripcion: 'Una fragancia adictiva con notas de café negro y vainilla.',
      variantes: [
        { volumen: 30, precio: 72000, stock: 14, sku: 'YSL-BOP-030' },
        { volumen: 50, precio: 98000, stock: 9, sku: 'YSL-BOP-050' },
        { volumen: 90, precio: 135000, stock: 5, sku: 'YSL-BOP-090' },
      ],
    },
  ];

  for (const data of perfumesData) {
    const { variantes, marcaIdx, categoriaIdx, ...perfumeFields } = data;

    const perfume = await prisma.perfume.upsert({
      where: { slug: perfumeFields.slug },
      update: {},
      create: {
        ...perfumeFields,
        marcaId: marcas[marcaIdx].id,
        categoriaId: categorias[categoriaIdx].id,
      },
    });

    for (const v of variantes) {
      await prisma.variantePerfume.upsert({
        where: { sku: v.sku },
        update: {},
        create: { ...v, perfumeId: perfume.id },
      });
    }
  }

  console.log('✅ Perfumes y variantes creados');

  // -------------------------------------------------------------------------
  // MÉTODOS DE PAGO
  // -------------------------------------------------------------------------
  const metodosPago = await Promise.all([
    prisma.metodoPago.upsert({
      where: { nombre: 'Tarjeta de Crédito' },
      update: {},
      create: { nombre: 'Tarjeta de Crédito', tipo: TipoMetodoPago.TARJETA_CREDITO },
    }),
    prisma.metodoPago.upsert({
      where: { nombre: 'Tarjeta de Débito' },
      update: {},
      create: { nombre: 'Tarjeta de Débito', tipo: TipoMetodoPago.TARJETA_DEBITO },
    }),
    prisma.metodoPago.upsert({
      where: { nombre: 'Transferencia Bancaria' },
      update: {},
      create: { nombre: 'Transferencia Bancaria', tipo: TipoMetodoPago.TRANSFERENCIA_BANCARIA },
    }),
    prisma.metodoPago.upsert({
      where: { nombre: 'Efectivo' },
      update: {},
      create: { nombre: 'Efectivo', tipo: TipoMetodoPago.EFECTIVO },
    }),
    prisma.metodoPago.upsert({
      where: { nombre: 'Mercado Pago' },
      update: {},
      create: { nombre: 'Mercado Pago', tipo: TipoMetodoPago.BILLETERA_VIRTUAL },
    }),
  ]);

  console.log('✅ Métodos de pago creados');

  console.log('\n🎉 Seeder finalizado correctamente');
  console.log('─────────────────────────────────────');
  console.log('👤 Admin:  admin@perfumeria.com / admin123');
  console.log('👤 User 1: sol@perfumeria.com   / user123');
  console.log('👤 User 2: juan@perfumeria.com  / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });