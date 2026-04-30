import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { id: req.params.id }
    });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Create blog (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, image, author, category, date, isActive } = req.body;
    const blog = await prisma.blogPost.create({
      data: {
        title, excerpt, content, image, author, category, date, isActive
      }
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Update blog (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Delete blog (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await prisma.blogPost.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

export default router;
