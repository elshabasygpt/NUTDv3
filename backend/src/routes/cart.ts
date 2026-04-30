import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to calculate prices based on user role and tier
const calculatePrices = (items: any[], user: any) => {
  let subTotal = 0;
  let discount = 0;
  let total = 0;
  
  const isDealer = user && user.role === 'DEALER';
  const discountRate = isDealer && user.dealerProfile ? user.dealerProfile.discountRate || 0 : 0;

  const processedItems = items.map((cartItem) => {
    const product = cartItem.product;
    let unitPrice = product.retailPrice; // Default to consumer price
    
    // If dealer, base price is wholesalePrice
    if (isDealer) {
      unitPrice = product.wholesalePrice;
    }

    const itemSubTotal = unitPrice * cartItem.quantity;
    let itemDiscount = 0;

    // Apply tier discount if dealer
    if (isDealer && discountRate > 0) {
      itemDiscount = itemSubTotal * (discountRate / 100);
    }

    const itemTotal = itemSubTotal - itemDiscount;

    subTotal += itemSubTotal;
    discount += itemDiscount;
    total += itemTotal;

    return {
      ...cartItem,
      unitPrice,
      total: itemTotal
    };
  });

  return { items: processedItems, subTotal, discount, total };
};

// @route   GET /api/cart
// @desc    Get current user's cart
// @access  Private
router.get('/', protect, async (req: any, res) => {
  try {
    const userId = req.user.id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    // Fetch user profile for pricing
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { dealerProfile: true }
    });

    const pricing = calculatePrices(cart.items, user);

    res.json({
      success: true,
      data: {
        id: cart.id,
        ...pricing
      }
    });
  } catch (error: any) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/cart/sync
// @desc    Sync local cart with DB cart
// @access  Private
router.post('/sync', protect, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { localItems } = req.body; // Array of { productId, quantity }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    if (localItems && localItems.length > 0) {
      for (const item of localItems) {
        // Upsert cart item
        await prisma.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: item.productId
            }
          },
          update: {
            quantity: { increment: item.quantity }
          },
          create: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity
          }
        });
      }
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { dealerProfile: true }
    });

    const pricing = calculatePrices(updatedCart!.items, user);

    res.json({ success: true, data: { id: cart.id, ...pricing } });
  } catch (error: any) {
    console.error('Sync cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', protect, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        cartId: cart.id,
        productId,
        quantity
      }
    });

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/cart/:productId
// @desc    Update item quantity
// @access  Private
router.put('/:productId', protect, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } }
      });
    } else {
      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity }
      });
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error: any) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', protect, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } }
    });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error: any) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', protect, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error: any) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
