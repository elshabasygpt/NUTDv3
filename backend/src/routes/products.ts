import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { q, brand, category, page = '1', limit = '12' } = req.query as Record<string, string>;
    
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause = {
      ...(brand ? { brand } : {}),
      ...(category ? { category } : {}),
      ...(q ? {
        OR: [
          { name_ar: { contains: q } },
          { name_en: { contains: q, mode: 'insensitive' as any } },
          { partNumber: { contains: q, mode: 'insensitive' as any } },
        ]
      } : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
      }),
      prisma.product.count({ where: whereClause })
    ]);

    res.json({ 
      data: products, 
      total, 
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (err) { next(err); }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: product });
  } catch (err) { next(err); }
});

// POST /api/products (Admin Only - simplified for now)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const data = req.body;
    
    // Check if partNumber exists
    const existing = await prisma.product.findUnique({ where: { partNumber: data.partNumber } });
    if (existing) {
      return res.status(400).json({ message: 'Product with this part number already exists' });
    }

    const product = await prisma.product.create({
      data: {
        partNumber: data.partNumber,
        name_ar: data.name_ar,
        name_en: data.name_en,
        brand: data.brand,
        category: data.category,
        retailPrice: Number(data.retailPrice),
        wholesalePrice: Number(data.wholesalePrice),
        stock: Number(data.stock) || 0,
        image: data.image || null,
        carMakes: data.carMakes || [],
        carModels: data.carModels || [],
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });
    
    res.status(201).json({ data: product, message: 'Product created successfully' });
  } catch (err) { next(err); }
});

// PUT /api/products/:id (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const data = req.body;
    
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        partNumber: data.partNumber,
        name_ar: data.name_ar,
        name_en: data.name_en,
        brand: data.brand,
        category: data.category,
        retailPrice: data.retailPrice ? Number(data.retailPrice) : undefined,
        wholesalePrice: data.wholesalePrice ? Number(data.wholesalePrice) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
        image: data.image,
        carMakes: data.carMakes,
        carModels: data.carModels,
        isActive: data.isActive
      }
    });
    
    res.json({ data: product, message: 'Product updated successfully' });
  } catch (err) { next(err); }
});

// DELETE /api/products/:id (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
