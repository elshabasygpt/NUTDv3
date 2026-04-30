import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all agencies
router.get('/', async (req, res) => {
  try {
    const agencies = await prisma.agency.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: agencies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Create agency (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, logo, description, origin, specialty, isActive } = req.body;
    const agency = await prisma.agency.create({
      data: {
        name, logo, description, origin, specialty, isActive
      }
    });
    res.status(201).json({ success: true, data: agency });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Update agency (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const agency = await prisma.agency.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, data: agency });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Delete agency (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await prisma.agency.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Agency deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

export default router;
