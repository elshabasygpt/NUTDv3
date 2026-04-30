import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Multer setup for logo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Default settings seed
const DEFAULT_SETTINGS: Record<string, string> = {
  header_phone: '+20 100 123 4567',
  header_logo: '/assets/images/nutd-logo.svg',
  header_nav: JSON.stringify([
    { labelEN: 'Home', labelAR: 'الرئيسية', to: '/' },
    { labelEN: 'Products', labelAR: 'المنتجات', to: '/products' },
    { labelEN: 'Agencies', labelAR: 'التوكيلات', to: '/agencies' },
    { labelEN: 'Dealers', labelAR: 'أقرب تاجر', to: '/dealers' },
    { labelEN: 'Blog', labelAR: 'المدونة', to: '/blog' },
    { labelEN: 'Wholesale Offers', labelAR: 'عروض الجملة', to: '/offers' },
    { labelEN: 'About', labelAR: 'من نحن', to: '/about' },
    { labelEN: 'Contact', labelAR: 'تواصل معنا', to: '/contact' }
  ]),
  homepage_hero: JSON.stringify({
    titleAr: "الشريك <span class='text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'>الاستراتيجي</span><br /><span class='text-primary'>لتجار قطع الغيار في مصر</span>",
    titleEn: "The <span class='text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'>Strategic Partner</span><br /><span class='text-primary'>For Auto Parts Dealers</span>",
    subtitleAr: "نوفر لك أفضل العلامات التجارية بأسعار الجملة التنافسية وبمخزون ضخم يلبي احتياجات متجرك.",
    subtitleEn: "We provide you with top brands at competitive wholesale prices and a huge stock to meet your store's needs.",
    slides: [
      { id: 1, image: '/hero/slide_1.png' },
      { id: 2, image: '/hero/slide_2.png' },
      { id: 3, image: '/hero/slide_3.png' }
    ],
    makes: [
      { value: 'Toyota', labelAr: 'تويوتا', labelEn: 'Toyota', icon: '/makes/toyota.png' },
      { value: 'Hyundai', labelAr: 'هيونداي', labelEn: 'Hyundai', icon: '/makes/hyundai.png' },
      { value: 'Kia', labelAr: 'كيا', labelEn: 'Kia', icon: '/makes/kia.png' },
      { value: 'Nissan', labelAr: 'نيسان', labelEn: 'Nissan', icon: '/makes/nissan.png' },
      { value: 'Honda', labelAr: 'هوندا', labelEn: 'Honda', icon: '/makes/honda.png' }
    ],
    models: ['Camry', 'Corolla', 'Elantra', 'Accent'],
    years: ['2024', '2023', '2022', '2021', '2020', '2019'],
    engines: ['1.6L', '2.0L', '2.4L', '2.5L', '3.5L V6'],
    partTypes: ['تيل فرامل', 'فلتر زيت', 'فلتر هواء', 'مساعدين', 'مقصات', 'بوجيهات', 'سير تقسيمة', 'طرمبة بنزين', 'طنابير', 'كومبريسور']
  }),
  homepage_features: JSON.stringify([
    { id: 1, icon: 'Shield', titleAr: 'الضمان الإلكتروني', titleEn: 'E-Warranty', descAr: 'تفعيل فوري لضمان قطع غيارك', descEn: 'Instant activation for your parts warranty' },
    { id: 2, icon: 'Package', titleAr: 'باقات الموزعين', titleEn: 'Dealer Packages', descAr: 'أسعار جملة وهوامش ربح عالية', descEn: 'Wholesale prices & high margins' },
    { id: 3, icon: 'MapPin', titleAr: 'تغطية شاملة', titleEn: 'Wide Coverage', descAr: 'شبكة موزعين في كل المحافظات', descEn: 'Dealer network in all provinces' },
    { id: 4, icon: 'Award', titleAr: 'الوكيل المعتمد', titleEn: 'Authorized Agent', descAr: 'للعلامات Borsehung, Vika, KDD, DPA', descEn: 'For Borsehung, Vika, KDD, DPA' }
  ]),
  homepage_brands: JSON.stringify([
    {
      id: 1,
      logoText: 'Borsehung',
      logoColor: 'text-[#005A3D]',
      taglineAr: 'جودة أوروبية',
      taglineEn: 'European Quality',
      descAr: 'أداء موثوق',
      descEn: 'Reliable Performance',
      bgColor: 'bg-[#F0F7F4]',
      btnColor: 'bg-[#005A3D]',
      imgUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      logoText: 'vika',
      logoColor: 'text-[#572B2B]',
      taglineAr: 'مطابقة عالية',
      taglineEn: 'High Conformity',
      descAr: 'للمعايير العالمية',
      descEn: 'To International Standards',
      bgColor: 'bg-[#F9F4F4]',
      btnColor: 'bg-[#572B2B]',
      imgUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      logoText: 'KDD',
      logoColor: 'text-[#0055FF]',
      taglineAr: 'اختيار ذكي',
      taglineEn: 'Smart Choice',
      descAr: 'لسيارات تدوم',
      descEn: 'For Cars That Last',
      bgColor: 'bg-[#F0F5FF]',
      btnColor: 'bg-[#0055FF]',
      imgUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80',
    }
  ]),
  homepage_carmakes: JSON.stringify([
    {
      id: 1,
      name: 'Toyota',
      labelAr: 'تويوتا',
      icon: '/makes/toyota.png',
      models: [
        { id: 101, name: 'Corolla', labelAr: 'تويوتا كورولا', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&w=400&q=80' },
        { id: 102, name: 'Camry', labelAr: 'تويوتا كامري', image: 'https://images.unsplash.com/photo-1629897048514-3dd74142a2af?auto=format&fit=crop&w=400&q=80' }
      ]
    },
    {
      id: 2,
      name: 'Skoda',
      labelAr: 'سكودا',
      icon: '/makes/skoda.png',
      models: [
        { id: 201, name: 'Octavia A7', labelAr: 'A7 سكودا اوكتافيا', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=400&q=80' }
      ]
    }
  ]),
  homepage_categories: JSON.stringify([
    {
      id: 'engine',
      nameEN: 'Engine Parts',
      nameAR: 'أجزاء المحرك',
      image: '/categories/engine.png',
      subcategories: [
        { id: 'piston', nameEN: 'Pistons & Rings', nameAR: 'بساتم وشنابر', image: '/categories/sub/piston.png' },
        { id: 'mount', nameEN: 'Engine Mounts', nameAR: 'قواعد محرك', image: '/categories/sub/mount.png' }
      ]
    },
    {
      id: 'brakes',
      nameEN: 'Brake System',
      nameAR: 'نظام الفرامل',
      image: '/categories/brakes.png',
      subcategories: [
        { id: 'pads', nameEN: 'Brake Pads', nameAR: 'تيل فرامل', image: '/categories/sub/pads.png' },
        { id: 'discs', nameEN: 'Brake Discs & Drums', nameAR: 'طنابير وأقراص فرامل', image: '/categories/sub/discs.png' }
      ]
    }
  ]),
  homepage_wholesale: JSON.stringify([
    { 
      id: '101', 
      name: 'طقم تيل فرامل أمامي', 
      brand: 'Borsehung', 
      oeNumber: '4D0698151D',
      partNumber: 'BR-1234',
      packageType: 'كرتونة (12 طقم)',
      moq: 1, 
      oldPrice: 14400, 
      newPrice: 10200, 
      savings: 4200,
      stock: 'متاح 50 كرتونة',
      image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=300&q=80' 
    },
    { 
      id: '102', 
      name: 'فلتر زيت أصلي', 
      brand: 'Vika', 
      oeNumber: '06L115562B',
      partNumber: 'VKA-3344',
      packageType: 'عرض: اشترِ 20 واحصل على 5 مجاناً',
      moq: 25, 
      oldPrice: 6250, 
      newPrice: 5000, 
      savings: 1250,
      stock: 'متاح 150 عرض',
      image: 'https://images.unsplash.com/photo-1503376710356-6f8e437011d8?w=300&q=80' 
    },
    { 
      id: '103', 
      name: 'مساعدين أمامي (طقم)', 
      brand: 'KDD', 
      oeNumber: '1K0413031',
      partNumber: 'KDD-9101',
      packageType: 'بالتة (10 أطقم)',
      moq: 1, 
      oldPrice: 35000, 
      newPrice: 28000, 
      savings: 7000,
      stock: 'متاح 10 بالتات',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&q=80' 
    },
    { 
      id: '104', 
      name: 'طقم سيور كامل', 
      brand: 'Borsehung', 
      oeNumber: '5Q0129620B',
      partNumber: 'BR-1122',
      packageType: 'كرتونة (20 طقم)',
      moq: 1, 
      oldPrice: 36000, 
      newPrice: 27000, 
      savings: 9000,
      stock: 'متاح 30 كرتونة',
      image: 'https://images.unsplash.com/photo-1606524177742-b062b9a7b93a?w=300&q=80' 
    }
  ])
};

// @route   GET /api/settings
// @desc    Get all settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert to key-value pairs
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    // Merge with defaults for missing keys
    const finalSettings = { ...DEFAULT_SETTINGS, ...settingsMap };

    res.json({
      success: true,
      data: finalSettings
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/settings
// @desc    Update multiple settings
// @access  Private (Admin only)
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body; // Expects { key1: value1, key2: value2 }
    
    const updatePromises = Object.entries(updates).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/settings/upload-logo
// @desc    Upload a new logo
// @access  Private (Admin only)
router.post('/upload-logo', protect, adminOnly, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Save to settings
    await prisma.setting.upsert({
      where: { key: 'header_logo' },
      update: { value: imageUrl },
      create: { key: 'header_logo', value: imageUrl }
    });

    res.status(200).json({
      success: true,
      data: { url: imageUrl }
    });
  } catch (error: any) {
    console.error('Upload logo error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

export default router;
