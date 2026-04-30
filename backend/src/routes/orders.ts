import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, AuthRequest, adminOnly } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/orders
router.get('/', protect, async (req: AuthRequest, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const userId = isAdmin ? undefined : req.user.id;
    
    const orders = await prisma.order.findMany({
      where: userId ? { userId } : {},
      include: { 
        user: { include: { dealerProfile: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: orders, total: orders.length });
  } catch (err) { next(err); }
});

// POST /api/orders
router.post('/', protect, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user.id;
    const { shippingAddr, notes } = req.body;

    // Fetch user and cart
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { dealerProfile: true }
    });
    
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const isDealer = user?.role === 'DEALER';
    const discountRate = isDealer && user?.dealerProfile ? user.dealerProfile.discountRate || 0 : 0;

    let subTotal = 0;
    let discount = 0;
    let total = 0;
    const orderItemsData = [];

    // Check stock and calculate prices
    for (const item of cart.items) {
      const product = item.product;
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name_en}` });
      }

      let unitPrice = product.retailPrice;
      if (isDealer) {
        unitPrice = product.wholesalePrice;
      }

      const itemSubTotal = unitPrice * item.quantity;
      let itemDiscount = 0;

      if (isDealer && discountRate > 0) {
        itemDiscount = itemSubTotal * (discountRate / 100);
      }

      const itemTotal = itemSubTotal - itemDiscount;

      subTotal += itemSubTotal;
      discount += itemDiscount;
      total += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        total: itemTotal
      });
    }

    // Transaction: Create order, decrement stock, clear cart
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
          userId,
          status: 'PENDING',
          subTotal,
          discount,
          total,
          shippingAddr,
          notes,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      // 2. Decrement stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 3. Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    res.status(201).json({ success: true, data: order, message: 'Order created successfully' });
  } catch (err) { next(err); }
});

// PUT /api/orders/:id (Admin only)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body as { status: any };
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ data: order });
  } catch (err) { next(err); }
});

export default router;
