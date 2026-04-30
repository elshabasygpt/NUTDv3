import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/dealers (Admin & Public)
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query; // e.g. status=active
    const dealers = await prisma.user.findMany({
      where: { 
        role: 'DEALER',
        ...(status === 'active' ? { isActive: true } : {})
      },
      include: {
        dealerProfile: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format the response to flatten it for the frontend
    const formattedDealers = dealers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      ...user.dealerProfile
    }));

    res.json({ data: formattedDealers, total: dealers.length });
  } catch (err) { next(err); }
});

// PUT /api/dealers/:id (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const data = req.body;
    
    // Update the User part (approval status)
    if (data.isActive !== undefined) {
      await prisma.user.update({
        where: { id: req.params.id },
        data: { isActive: data.isActive }
      });
    }

    // Update the DealerProfile part
    if (data.tier || data.discountRate !== undefined || data.companyName) {
      await prisma.dealerProfile.update({
        where: { userId: req.params.id },
        data: {
          ...(data.tier ? { tier: data.tier } : {}),
          ...(data.discountRate !== undefined ? { discountRate: Number(data.discountRate) } : {}),
          ...(data.companyName ? { companyName: data.companyName } : {}),
        }
      });
    }

    // Fetch updated record
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { dealerProfile: true }
    });

    res.json({ data: updatedUser, message: 'Dealer updated successfully' });
  } catch (err) { next(err); }
});

export default router;
