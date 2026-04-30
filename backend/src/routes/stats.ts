import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/stats (Admin Only)
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalDealers,
      totalOrders,
      totalWarranties,
      recentOrders,
      revenue
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count({ where: { role: 'DEALER' } }),
      prisma.order.count(),
      prisma.warranty.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { include: { dealerProfile: true } } }
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING'] } }
      })
    ]);

    // Mock Monthly Revenue Data for Charts
    const currentMonth = new Date().getMonth();
    const monthsArabic = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const monthsEnglish = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthlyData.push({
        name_ar: monthsArabic[monthIndex],
        name_en: monthsEnglish[monthIndex],
        revenue: Math.floor(Math.random() * 50000) + 10000,
        orders: Math.floor(Math.random() * 50) + 10
      });
    }

    res.json({
      data: {
        products: totalProducts,
        dealers: totalDealers,
        orders: totalOrders,
        warranties: totalWarranties,
        revenue: revenue._sum.total || 0,
        recentOrders,
        monthlyData
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
