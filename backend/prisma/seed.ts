import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      { partNumber: 'BS-1234', name_ar: 'فحمات بريك أمامية',   name_en: 'Front Brake Pads',       brand: 'Borshing', category: 'Brakes',     price: 125, rating: 4.8, reviews: 42 },
      { partNumber: 'KD-234',  name_ar: 'فلتر زيت',            name_en: 'Oil Filter',              brand: 'KDD',      category: 'Filters',    price: 45,  rating: 4.7, reviews: 89 },
      { partNumber: 'VK-8567', name_ar: 'ماسك أمامي',          name_en: 'Front Bumper',            brand: 'Vika',     category: 'Body',       price: 320, rating: 4.9, reviews: 31 },
      { partNumber: 'KD-1122', name_ar: 'فلتر هواء',           name_en: 'Air Filter',              brand: 'KDD',      category: 'Filters',    price: 65,  rating: 4.6, reviews: 55 },
      { partNumber: 'BS-9678', name_ar: 'قرص بريك',            name_en: 'Brake Disc',              brand: 'Borshing', category: 'Brakes',     price: 210, rating: 4.7, reviews: 28 },
      { partNumber: 'VK-3344', name_ar: 'مساعد أمامي',         name_en: 'Front Shock Absorber',    brand: 'Vika',     category: 'Suspension', price: 380, rating: 4.8, reviews: 19 },
      { partNumber: 'BS-5566', name_ar: 'فحمات بريك خلفية',   name_en: 'Rear Brake Pads',         brand: 'Borshing', category: 'Brakes',     price: 110, rating: 4.5, reviews: 36 },
      { partNumber: 'KD-7788', name_ar: 'فلتر مكيف',           name_en: 'Cabin Air Filter',        brand: 'KDD',      category: 'Filters',    price: 55,  rating: 4.4, reviews: 62 },
      { partNumber: 'VK-2211', name_ar: 'مساعد خلفي',          name_en: 'Rear Shock Absorber',     brand: 'Vika',     category: 'Suspension', price: 350, rating: 4.7, reviews: 24 },
      { partNumber: 'BS-3322', name_ar: 'طقم تيل بريك',        name_en: 'Brake Caliper Kit',       brand: 'Borshing', category: 'Brakes',     price: 290, rating: 4.9, reviews: 15 },
    ],
  });

  // Dealers
  const d1 = await prisma.dealer.upsert({
    where: { id: 'dealer-riyadh-1' },
    update: {},
    create: { id: 'dealer-riyadh-1', name: 'تجارة الخليج للسيارات', city: 'الرياض', phone: '0112345678', address: 'طريق الملك فهد', latitude: 24.7136, longitude: 46.6753 },
  });
  const d2 = await prisma.dealer.upsert({
    where: { id: 'dealer-jeddah-1' },
    update: {},
    create: { id: 'dealer-jeddah-1', name: 'شركة المسرع الخليجي', city: 'جدة', phone: '0126543210', address: 'طريق المدينة', latitude: 21.3891, longitude: 39.8579 },
  });

  // Orders
  await prisma.order.createMany({
    data: [
      { dealerId: d1.id, status: 'completed',  total: 1250 },
      { dealerId: d1.id, status: 'pending',    total: 430 },
      { dealerId: d2.id, status: 'processing', total: 890 },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
