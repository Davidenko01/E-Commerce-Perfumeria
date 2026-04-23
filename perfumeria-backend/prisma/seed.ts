import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Starting seed...');

  // Clean existing data
  await prisma.pagoEvento.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.itemCarrito.deleteMany();
  await prisma.carrito.deleteMany();
  await prisma.variantePerfume.deleteMany();
  await prisma.perfume.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.marca.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create Categories (Familias olfativas)
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nombre: 'Cítrica Fresca',
        descripcion: 'Notas frescas y vibrantes de frutas cítricas',
        slug: 'citrica-fresca',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Floral',
        descripcion: 'Aromas dominated por flores',
        slug: 'floral',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Amaderada',
        descripcion: 'Notas de maderas como sándalo y cedro',
        slug: 'amaderada',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Oriental',
        descripcion: 'Aromas exóticos con especias y resinas',
        slug: 'oriental',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Aromática Especiada',
        descripcion: 'Hierbas frescas y especias',
        slug: 'aromatica-especiada',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Frual Dulce',
        descripcion: 'Combinación de frutas con notas dulces',
        slug: 'frual-dulce',
      },
    }),
  ]);

  console.log(`✅ Created ${categorias.length} categorias`);

  // Create Brands
  const marcas = await Promise.all([
    prisma.marca.create({
      data: {
        nombre: 'Dior',
        descripcion: 'Maison de alta perfumería francesa',
        paisOrigen: 'Francia',
        logoUrl: '/logos/dior.png',
      },
    }),
    prisma.marca.create({
      data: {
        nombre: 'Chanel',
        descripcion: 'Elegancia atemporal francesa',
        paisOrigen: 'Francia',
        logoUrl: '/logos/chanel.png',
      },
    }),
    prisma.marca.create({
      data: {
        nombre: 'Tom Ford',
        descripcion: 'Lujo y sensualidad estadounidense',
        paisOrigen: 'Estados Unidos',
        logoUrl: '/logos/tomford.png',
      },
    }),
    prisma.marca.create({
      data: {
        nombre: 'Yves Saint Laurent',
        descripcion: 'Perfumería francesa icónica',
        paisOrigen: 'Francia',
        logoUrl: '/logos/ysl.png',
      },
    }),
    prisma.marca.create({
      data: {
        nombre: 'Paco Rabanne',
        descripcion: 'Innovación y audacia española',
        paisOrigen: 'España',
        logoUrl: '/logos/pacorabanne.png',
      },
    }),
    prisma.marca.create({
      data: {
        nombre: 'Thierry Mugler',
        descripcion: 'Perfumería bold y memorable',
        paisOrigen: 'Francia',
        logoUrl: '/logos/mugler.png',
      },
    }),
  ]);

  console.log(`✅ Created ${marcas.length} marcas`);

  // Create Perfumes with Variants
  const perfumesData = [
    {
      nombre: 'Sauvage',
      marcaId: marcas[0].id,
      categoriaId: categorias[0].id,
      descripcion:
        'Una creación radicalmente fresca con notas de bergamota de Calabria y ambroxano. Sauvage es unarco de frescas materias primas de la naturaleza.',
      concentracion: 'EDT',
      genero: 'HOMBRE',
      tipo: 'designer',
      variantes: [
        { volumen: 30, precio: 45000, stock: 15, sku: 'SAU-30' },
        { volumen: 50, precio: 62000, stock: 20, sku: 'SAU-50' },
        { volumen: 100, precio: 85000, stock: 25, sku: 'SAU-100' },
      ],
    },
    {
      nombre: 'Miss Dior Blooming Bouquet',
      marcaId: marcas[0].id,
      categoriaId: categorias[1].id,
      descripcion:
        'Un ramo de flores blancas donde la rosa damascena se mezcla con la peonía y el absolute deiris. Frescorradiante y femenino.',
      concentracion: 'EDT',
      genero: 'MUJER',
      tipo: 'designer',
      variantes: [
        { volumen: 30, precio: 38000, stock: 12, sku: 'MSD-30' },
        { volumen: 50, precio: 55000, stock: 18, sku: 'MSD-50' },
        { volumen: 100, precio: 75000, stock: 10, sku: 'MSD-100' },
      ],
    },
    {
      nombre: 'Bleu de Chanel',
      marcaId: marcas[1].id,
      categoriaId: categorias[2].id,
      descripcion:
        'Una interpretación audaz y luminosa de Chanel Bleu. Notas de patchouli, sandalo y cedro de Virginia se unen en una firma moderna.',
      concentracion: 'EDP',
      genero: 'HOMBRE',
      tipo: 'designer',
      variantes: [
        { volumen: 50, precio: 68000, stock: 14, sku: 'BDC-50' },
        { volumen: 100, precio: 92000, stock: 20, sku: 'BDC-100' },
      ],
    },
    {
      nombre: 'Coco Mademoiselle',
      marcaId: marcas[1].id,
      categoriaId: categorias[3].id,
      descripcion:
        'Una oriental moderna, chispeante y迷糊 fresca. Notas de naranja amarga, rosa y patchouli se entrelazan en una composición audaz.',
      concentracion: 'EDP',
      genero: 'MUJER',
      tipo: 'designer',
      variantes: [
        { volumen: 50, precio: 72000, stock: 8, sku: 'CM-50' },
        { volumen: 100, precio: 98000, stock: 12, sku: 'CM-100' },
      ],
    },
    {
      nombre: 'Black Orchid',
      marcaId: marcas[2].id,
      categoriaId: categorias[3].id,
      descripcion:
        'Una orquídea negra sumergiuxe en un bosque de notas oscuras. patchouli, madera de agar y vanilla crean un misterio profundo.',
      concentracion: 'PARFUM',
      genero: 'MUJER',
      tipo: 'niche',
      variantes: [
        { volumen: 50, precio: 125000, stock: 5, sku: 'BNO-50' },
        { volumen: 100, precio: 185000, stock: 3, sku: 'BNO-100' },
      ],
    },
    {
      nombre: 'Oud Wood',
      marcaId: marcas[2].id,
      categoriaId: categorias[2].id,
      descripcion:
        'Un oud sofisticado rodeado de maderas preciosas. Dal Rossi, cardamomo y ambergris en una fusión suave y elegante.',
      concentracion: 'EDP',
      genero: 'HOMBRE',
      tipo: 'niche',
      variantes: [
        { volumen: 50, precio: 145000, stock: 6, sku: 'OWD-50' },
        { volumen: 100, precio: 210000, stock: 4, sku: 'OWD-100' },
      ],
    },
    {
      nombre: 'La Nuit Y',
      marcaId: marcas[3].id,
      categoriaId: categorias[3].id,
      descripcion:
        'Una oriental amaderada nocturna. Notas de almizcle, madera de oud y lavanda se unen en una esencia seductora.',
      concentracion: 'EDP',
      genero: 'HOMBRE',
      tipo: 'designer',
      variantes: [
        { volumen: 50, precio: 52000, stock: 16, sku: 'LNY-50' },
        { volumen: 100, precio: 78000, stock: 22, sku: 'LNY-100' },
      ],
    },
    {
      nombre: 'Libre',
      marcaId: marcas[3].id,
      categoriaId: categorias[1].id,
      descripcion:
        'La esencia de la libertad: lavanda de Provence, naranja de Valencia y almizcle. Un floral баршинто freshness.',
      concentracion: 'EDP',
      genero: 'MUJER',
      tipo: 'designer',
      variantes: [
        { volumen: 30, precio: 42000, stock: 10, sku: 'LIB-30' },
        { volumen: 50, precio: 58000, stock: 15, sku: 'LIB-50' },
        { volumen: 100, precio: 82000, stock: 18, sku: 'LIB-100' },
      ],
    },
    {
      nombre: '1 Million',
      marcaId: marcas[4].id,
      categoriaId: categorias[3].id,
      descripcion:
        'Un oriental luminoso con notas de sangre de桂花, корица y tabaco rubio. La audacia en estado puro.',
      concentracion: 'EDT',
      genero: 'HOMBRE',
      tipo: 'designer',
      variantes: [
        { volumen: 50, precio: 48000, stock: 20, sku: '1ML-50' },
        { volumen: 100, precio: 68000, stock: 25, sku: '1ML-100' },
      ],
    },
    {
      nombre: 'Phantom',
      marcaId: marcas[4].id,
      categoriaId: categorias[2].id,
      descripcion:
        'El robot más走过来 de Paco Rabanne. Notas de lavanda, menta y vetiver en una fragancia futurista.',
      concentracion: 'EDP',
      genero: 'HOMBRE',
      tipo: 'designer',
      variantes: [
        { volumen: 50, precio: 55000, stock: 12, sku: 'PHN-50' },
        { volumen: 100, precio: 78000, stock: 18, sku: 'PHN-100' },
      ],
    },
    {
      nombre: 'Alien',
      marcaId: marcas[5].id,
      categoriaId: categorias[1].id,
      descripcion:
        'Una extraterrestre de origen ambre. notes of jasmine, woody amber and cashmere wood. Lo infinito en una fragancia.',
      concentracion: 'PARFUM',
      genero: 'MUJER',
      tipo: 'niche',
      variantes: [
        { volumen: 30, precio: 68000, stock: 7, sku: 'ALN-30' },
        { volumen: 50, precio: 95000, stock: 10, sku: 'ALN-50' },
        { volumen: 100, precio: 135000, stock: 5, sku: 'ALN-100' },
      ],
    },
    {
      nombre: 'Aventus',
      marcaId: marcas[5].id,
      categoriaId: categorias[0].id,
      descripcion:
        'La leyenda de Creed. bergamota corsa, abedul y一点点 de almizcle. Para hombres que marcan época.',
      concentracion: 'EDP',
      genero: 'HOMBRE',
      tipo: 'niche',
      variantes: [
        { volumen: 50, precio: 175000, stock: 4, sku: 'AVN-50' },
        { volumen: 100, precio: 250000, stock: 3, sku: 'AVN-100' },
      ],
    },
  ];

  for (const perfumeData of perfumesData) {
    const { variantes, ...data } = perfumeData;
    const slug = data.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await prisma.perfume.create({
      data: {
        ...data,
        slug,
        activo: true,
        variantes: {
          create: variantes,
        },
      },
    });
  }

  console.log(`✅ Created ${perfumesData.length} perfumes`);

  // Create default admin user
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      apellido: 'Perfumería',
      email: 'admin@perfumeria.com',
      passwordHash: hashedPassword,
      telefono: '+54 11 1234 5678',
      role: 'ADMIN',
      activo: true,
    },
  });

  console.log('✅ Created admin user (admin@perfumeria.com / admin123)');

  console.log('🌸 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
