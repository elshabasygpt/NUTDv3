import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Create offer (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { partNumber, oeNumber, name, brand, category, packageType, moq, oldPrice, newPrice, stockInfo, image, isActive } = req.body;
    const offer = await prisma.offer.create({
      data: {
        partNumber, oeNumber, name, brand, category, packageType, moq: Number(moq), oldPrice: Number(oldPrice), newPrice: Number(newPrice), stockInfo, image, isActive
      }
    });
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Update offer (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.moq) data.moq = Number(data.moq);
    if (data.oldPrice) data.oldPrice = Number(data.oldPrice);
    if (data.newPrice) data.newPrice = Number(data.newPrice);

    const offer = await prisma.offer.update({
      where: { id: req.params.id },
      data
    });
    res.json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Delete offer (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await prisma.offer.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Offer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

export default router;
