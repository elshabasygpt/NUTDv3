import { X, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalItems } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-[90%] max-w-[400px] bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform translate-x-0`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-black text-[#1C1C1C] flex items-center gap-2">
            {isRTL ? 'قائمة الطلبات' : 'Quote Request'}
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{totalItems}</span>
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <div className="text-5xl">🛒</div>
              <p className="font-bold">{isRTL ? 'السلة فارغة' : 'Your cart is empty'}</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-4 p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 p-2 shrink-0">
                  <img 
                    src={`https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&q=70&auto=format&seed=${item.product.id}`} 
                    alt={isRTL ? item.product.name_ar : item.product.name_en}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-[#1C1C1C] text-sm line-clamp-1">{isRTL ? item.product.name_ar : item.product.name_en}</h4>
                      <div className="text-xs font-bold text-gray-400 mt-0.5">{item.product.partNumber}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-auto flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">{isRTL ? 'الكمية:' : 'Qty:'}</span>
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-gray-500 hover:text-primary transition-colors"
                      >-</button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-gray-500 hover:text-primary transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
            >
              {isRTL ? 'إتمام الطلب' : 'Checkout'}
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
            <p className="text-xs text-center text-gray-500 font-bold mt-3">
              {isRTL ? 'إتمام الطلب والدفع' : 'Complete your order and payment.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
