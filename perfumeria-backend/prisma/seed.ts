import { PrismaClient, Concentracion, Genero, TipoNota } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

async function main() {
  console.log('🌱 Iniciando seeding...');

  // ========================
  // 1. MARCAS
  // ========================
  const marcasData = [
    { nombre: 'Chanel', slug: 'chanel', paisOrigen: 'Francia', descripcion: 'Lujo francés atemporal' },
    { nombre: 'Dior', slug: 'dior', paisOrigen: 'Francia', descripcion: 'Elegancia y modernidad' },
    { nombre: 'Tom Ford', slug: 'tom-ford', paisOrigen: 'EE.UU.', descripcion: 'Oscuro, sensual y sofisticado' },
    { nombre: 'Creed', slug: 'creed', paisOrigen: 'Reino Unido', descripcion: 'Perfumería artesanal desde 1760' },
    { nombre: 'Acqua di Parma', slug: 'acqua-di-parma', paisOrigen: 'Italia', descripcion: 'Frescura y tradición italiana' },
    { nombre: 'Byredo', slug: 'byredo', paisOrigen: 'Suecia', descripcion: 'Minimalismo nórdico' },
    { nombre: 'Maison Margiela', slug: 'maison-margiela', paisOrigen: 'Francia', descripcion: 'Fragancias conceptuales' },
  ];

  console.log('📦 Insertando marcas...');
  for (const marca of marcasData) {
    await prisma.marca.upsert({
      where: { slug: marca.slug },
      update: {},
      create: marca,
    });
  }

  // ========================
  // 2. FAMILIAS OLFATIVAS
  // ========================
  const familiasData = [
    { nombre: 'Cítricos' },
    { nombre: 'Florales' },
    { nombre: 'Amaderados' },
    { nombre: 'Orientales' },
    { nombre: 'Fougère' },
    { nombre: 'Chypre' },
    { nombre: 'Cuero' },
    { nombre: 'Gourmand' },
  ];

  console.log('🌿 Insertando familias olfativas...');
  for (const familia of familiasData) {
    await prisma.familiaOlfativa.upsert({
      where: { nombre: familia.nombre },
      update: {},
      create: familia,
    });
  }

  // ========================
  // 3. CATEGORÍAS (si decides mantener el modelo)
  // ========================
  const categoriasData = [
    { nombre: 'Perfume', slug: 'perfume', descripcion: 'Alta concentración', activo: true },
    { nombre: 'Eau de Parfum', slug: 'edp', descripcion: 'Concentración media-alta', activo: true },
    { nombre: 'Eau de Toilette', slug: 'edt', descripcion: 'Concentración media', activo: true },
    { nombre: 'Eau de Cologne', slug: 'edc', descripcion: 'Concentración baja', activo: true },
  ];

  console.log('📂 Insertando categorías...');
  for (const cat of categoriasData) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // ========================
  // 4. NOTAS OLFATIVAS
  // ========================
  const notasData = [
    // SALIDA
    { nombre: 'Bergamota' },
    { nombre: 'Limón' },
    { nombre: 'Naranja' },
    { nombre: 'Pomelo' },
    { nombre: 'Mandarina' },
    { nombre: 'Lavanda' },
    { nombre: 'Menta' },
    { nombre: 'Pimienta rosa' },
    // CORAZÓN
    { nombre: 'Rosa' },
    { nombre: 'Jazmín' },
    { nombre: 'Ylang-Ylang' },
    { nombre: 'Geranio' },
    { nombre: 'Canela' },
    { nombre: 'Cardamomo' },
    { nombre: 'Nuez moscada' },
    // FONDO
    { nombre: 'Sándalo' },
    { nombre: 'Cedro' },
    { nombre: 'Vetiver' },
    { nombre: 'Pachulí' },
    { nombre: 'Oud' },
    { nombre: 'Vainilla' },
    { nombre: 'Almizcle' },
    { nombre: 'Ámbar' },
    { nombre: 'Cuero' },
    { nombre: 'Tabaco' },
  ];

  console.log('🌼 Insertando notas...');
  for (const nota of notasData) {
    await prisma.nota.upsert({
      where: { nombre: nota.nombre },
      update: {},
      create: nota,
    });
  }

  // ========================
  // 5. PERFUMES DE EJEMPLO (con notas y variantes)
  // ========================
  console.log('👃 Insertando perfumes...');

  // Obtener referencias
  const chanel = await prisma.marca.findUnique({ where: { slug: 'chanel' } });
  const dior = await prisma.marca.findUnique({ where: { slug: 'dior' } });
  const tomFord = await prisma.marca.findUnique({ where: { slug: 'tom-ford' } });
  const amaderado = await prisma.familiaOlfativa.findUnique({ where: { nombre: 'Amaderados' } });
  const floral = await prisma.familiaOlfativa.findUnique({ where: { nombre: 'Florales' } });
  const oriental = await prisma.familiaOlfativa.findUnique({ where: { nombre: 'Orientales' } });
  const categoriaEdp = await prisma.categoria.findUnique({ where: { slug: 'edp' } });
  const categoriaEdt = await prisma.categoria.findUnique({ where: { slug: 'edt' } });

  // Helper para obtener IDs de notas
  async function getNotaId(nombre: string) {
    const nota = await prisma.nota.findUnique({ where: { nombre } });
    if (!nota) throw new Error(`Nota no encontrada: ${nombre}`);
    return nota.id;
  }

  // Perfume 1: Bleu de Chanel
  const bleu = await prisma.perfume.upsert({
    where: { slug: 'bleu-de-chanel' },
    update: {},
    create: {
      nombre: 'Bleu de Chanel',
      slug: 'bleu-de-chanel',
      marcaId: chanel!.id,
      categoriaId: categoriaEdp!.id,
      familiaOlfativaId: amaderado!.id,
      concentracion: Concentracion.EDP,
      genero: Genero.HOMBRE,
      descripcion: 'Un aroma amaderado y aromático que captura la esencia de la libertad.',
      imagenUrl: 'https://example.com/bleu.jpg',
      galeriaImagenes: ['https://example.com/bleu1.jpg', 'https://example.com/bleu2.jpg'],
      destacado: true,
      activo: true,
    },
  });

  // Notas para Bleu de Chanel
  const bleuNotas = [
    { nota: 'Pomelo', tipo: TipoNota.SALIDA },
    { nota: 'Limón', tipo: TipoNota.SALIDA },
    { nota: 'Menta', tipo: TipoNota.SALIDA },
    { nota: 'Jazmín', tipo: TipoNota.CORAZON },
    { nota: 'Incienso', tipo: TipoNota.CORAZON }, // Incienso no está en la lista, lo creamos
    { nota: 'Cedro', tipo: TipoNota.CORAZON },
    { nota: 'Sándalo', tipo: TipoNota.FONDO },
    { nota: 'Vainilla', tipo: TipoNota.FONDO },
    { nota: 'Almizcle', tipo: TipoNota.FONDO },
  ];

  // Crear nota "Incienso" si no existe
  await prisma.nota.upsert({ where: { nombre: 'Incienso' }, update: {}, create: { nombre: 'Incienso' } });

  for (const item of bleuNotas) {
    const notaId = await getNotaId(item.nota);
    await prisma.perfumeNota.upsert({
      where: {
        perfumeId_notaId_tipoNota: {
          perfumeId: bleu.id,
          notaId: notaId,
          tipoNota: item.tipo,
        },
      },
      update: {},
      create: {
        perfumeId: bleu.id,
        notaId: notaId,
        tipoNota: item.tipo,
      },
    });
  }

  // Variantes de Bleu
  await prisma.variantePerfume.createMany({
    data: [
      { perfumeId: bleu.id, volumen: 50, precio: 120.00, sku: 'BLEU-50', stock: 25, activo: true },
      { perfumeId: bleu.id, volumen: 100, precio: 180.00, sku: 'BLEU-100', stock: 15, activo: true },
      { perfumeId: bleu.id, volumen: 150, precio: 230.00, sku: 'BLEU-150', stock: 10, activo: true },
    ],
    skipDuplicates: true,
  });

  // Perfume 2: Sauvage de Dior
  const sauvage = await prisma.perfume.upsert({
    where: { slug: 'sauvage-dior' },
    update: {},
    create: {
      nombre: 'Sauvage',
      slug: 'sauvage-dior',
      marcaId: dior!.id,
      categoriaId: categoriaEdt!.id,
      familiaOlfativaId: amaderado!.id,
      concentracion: Concentracion.EDT,
      genero: Genero.HOMBRE,
      descripcion: 'Inspirado en el desierto, una fragancia fresca y poderosa.',
      imagenUrl: 'https://example.com/sauvage.jpg',
      galeriaImagenes: ['https://example.com/sauvage1.jpg'],
      destacado: true,
    },
  });

  const sauvageNotas = [
    { nota: 'Bergamota', tipo: TipoNota.SALIDA },
    { nota: 'Pimienta rosa', tipo: TipoNota.SALIDA },
    { nota: 'Lavanda', tipo: TipoNota.CORAZON },
    { nota: 'Vetiver', tipo: TipoNota.FONDO },
    { nota: 'Cedro', tipo: TipoNota.FONDO },
  ];
  for (const item of sauvageNotas) {
    const notaId = await getNotaId(item.nota);
    await prisma.perfumeNota.upsert({
      where: {
        perfumeId_notaId_tipoNota: { perfumeId: sauvage.id, notaId, tipoNota: item.tipo },
      },
      update: {},
      create: { perfumeId: sauvage.id, notaId, tipoNota: item.tipo },
    });
  }
  await prisma.variantePerfume.createMany({
    data: [
      { perfumeId: sauvage.id, volumen: 60, precio: 95.00, sku: 'SAUV-60', stock: 40, activo: true },
      { perfumeId: sauvage.id, volumen: 100, precio: 140.00, sku: 'SAUV-100', stock: 20, activo: true },
    ],
    skipDuplicates: true,
  });

  // Perfume 3: Tom Ford Tobacco Vanille
  const tobacco = await prisma.perfume.upsert({
    where: { slug: 'tobacco-vanille' },
    update: {},
    create: {
      nombre: 'Tobacco Vanille',
      slug: 'tobacco-vanille',
      marcaId: tomFord!.id,
      categoriaId: categoriaEdp!.id,
      familiaOlfativaId: oriental!.id,
      concentracion: Concentracion.PARFUM,
      genero: Genero.UNISEX,
      descripcion: 'Cálido, especiado y dulce. Tabaco y vainilla en perfecta armonía.',
      imagenUrl: 'https://example.com/tobacco.jpg',
      galeriaImagenes: [],
      destacado: true,
    },
  });

  const tobaccoNotas = [
    { nota: 'Tabaco', tipo: TipoNota.SALIDA },
    { nota: 'Vainilla', tipo: TipoNota.CORAZON },
    { nota: 'Cacao', tipo: TipoNota.CORAZON },
    { nota: 'Ámbar', tipo: TipoNota.FONDO },
    { nota: 'Sándalo', tipo: TipoNota.FONDO },
  ];
  // Aseguramos que existe "Cacao"
  await prisma.nota.upsert({ where: { nombre: 'Cacao' }, update: {}, create: { nombre: 'Cacao' } });
  for (const item of tobaccoNotas) {
    const notaId = await getNotaId(item.nota);
    await prisma.perfumeNota.upsert({
      where: {
        perfumeId_notaId_tipoNota: { perfumeId: tobacco.id, notaId, tipoNota: item.tipo },
      },
      update: {},
      create: { perfumeId: tobacco.id, notaId, tipoNota: item.tipo },
    });
  }
  await prisma.variantePerfume.createMany({
    data: [
      { perfumeId: tobacco.id, volumen: 50, precio: 250.00, sku: 'TF-TV-50', stock: 8, activo: true },
      { perfumeId: tobacco.id, volumen: 100, precio: 420.00, sku: 'TF-TV-100', stock: 5, activo: true },
    ],
    skipDuplicates: true,
  });

  // ========================
  // 6. USUARIO DE PRUEBA
  // ========================
  const bcrypt = require('bcrypt');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@perfumeria.com' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@perfumeria.com',
      passwordHash,
      role: 'ADMIN',
      activo: true,
    },
  });

  console.log('✅ Seeding completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });