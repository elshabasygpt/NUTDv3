import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// GET /api/warranties (Admin sees all, Dealer sees own)
router.get('/', protect, async (req: AuthRequest, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const userId = isAdmin ? undefined : req.user.id;
    
    const warranties = await prisma.warranty.findMany({
      where: userId ? { userId } : {},
      include: { user: { include: { dealerProfile: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: warranties, total: warranties.length });
  } catch (err) { next(err); }
});

// PUT /api/warranties/:id (Admin update status)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    const warranty = await prisma.warranty.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ data: warranty });
  } catch (err) { next(err); }
});

// POST /api/warranties (Public / Dealer Registration)
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    let userId = null;
    
    // Check if token exists to attach userId
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as any;
        userId = decoded.id;
      } catch (e) {} // ignore invalid token on public route
    }

    const warranty = await prisma.warranty.create({
      data: {
        warrantyNumber: `WR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        userId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        vin: data.vin,
        carMake: data.carMake,
        carModel: data.carModel,
        carYear: Number(data.carYear),
        partNumber: data.partNumber,
        status: 'PENDING'
      }
    });
    res.status(201).json({ data: warranty, message: 'Warranty registered successfully' });
  } catch (err) { next(err); }
});

export default router;
