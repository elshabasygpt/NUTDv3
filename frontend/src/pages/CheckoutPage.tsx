import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Phone, User, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const CheckoutPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { items, clearCart, subTotal, discount, total, isLoadingCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddr, setShippingAddr] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK'>('COD');

  const handleCheckout = async () => {
    if (!shippingAddr || !customerName || !customerPhone) {
      alert(isRTL ? 'يرجى إكمال بيانات الشحن والتواصل' : 'Please complete shipping and contact details');
      return;
    }

    setIsSubmitting(true);
    try {
      if (user) {
        // Authenticated checkout (Dealer/Admin)
        const res = await api.post('/orders', {
          shippingAddr,
          notes: `Name: ${customerName}\nPhone: ${customerPhone}\nPayment: ${paymentMethod}\n${notes}`,
        });

        if (res.data.success) {
          clearCart();
          navigate('/order-success', { state: { orderId: res.data.data.orderNumber } });
        }
      } else {
        // Guest Checkout (Optional: if we support guest orders in DB, but backend requires auth)
        // Since backend requires protect middleware, guests cannot order.
        alert(isRTL ? 'يجب تسجيل الدخول لإتمام الطلب.' : 'You must be logged in to complete the order.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Checkout failed', error);
      alert(error.response?.data?.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-[#F8F9FA]" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-black text-[#1C1C1C]">{isRTL ? 'سلة المشتريات فارغة' : 'Your cart is empty'}</h2>
        <button onClick={() => navigate('/products')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-sm">
          {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-[#F8F9FA]" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-black text-[#1C1C1C]">{isRTL ? 'يرجى تسجيل الدخول' : 'Please Login'}</h2>
        <p className="text-gray-500 font-bold mb-4">
          {isRTL ? 'تحتاج إلى حساب تاجر لإتمام الطلب' : 'You need a dealer account to checkout'}
        </p>
        <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-sm">
          {isRTL ? 'تسجيل الدخول' : 'Login'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-4">
            {isRTL ? 'إتمام الطلب' : 'Checkout'}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Right Side / Form */}
          <div className="flex-1 space-y-6">
            
            {/* 1. Customer Details */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#1C1C1C] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">1</span>
                {isRTL ? 'بيانات الشحن' : 'Shipping Details'}
              </h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                    <User size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder={isRTL ? 'الاسم بالكامل' : 'Full Name'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 ps-12 pe-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                    <Phone size={20} />
                  </div>
                  <input 
                    type="tel" 
                    placeholder={isRTL ? 'رقم الجوال' : 'Phone Number'}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 ps-12 pe-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="relative">
                  <div className="absolute top-4 start-0 flex items-start ps-4 pointer-events-none text-gray-400">
                    <MapPin size={20} />
                  </div>
                  <textarea 
                    placeholder={isRTL ? 'عنوان الشحن بالتفصيل' : 'Detailed Shipping Address'}
                    value={shippingAddr}
                    onChange={(e) => setShippingAddr(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 ps-12 pe-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="relative">
                  <div className="absolute top-4 start-0 flex items-start ps-4 pointer-events-none text-gray-400">
                    <FileText size={20} />
                  </div>
                  <textarea 
                    placeholder={isRTL ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 ps-12 pe-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#1C1C1C] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">2</span>
                {isRTL ? 'طريقة الدفع' : 'Payment Method'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                    paymentMethod === 'COD' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-100 hover:border-primary/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'COD' ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'COD' && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1C1C]">
                      {isRTL ? 'دفع عند الاستلام' : 'Cash on Delivery'}
                    </h4>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('BANK')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                    paymentMethod === 'BANK' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-100 hover:border-primary/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'BANK' ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'BANK' && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1C1C]">
                      {isRTL ? 'تحويل بنكي / أجل' : 'Bank Transfer / Credit'}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Left Side / Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-black text-[#1C1C1C] mb-6 border-b border-gray-100 pb-4">
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </h3>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pe-2">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                      <img 
                        src={`https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&q=70&auto=format&seed=${item.product.id}`}
                        alt={item.product.name_en}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h4 className="font-bold text-sm text-[#1C1C1C] line-clamp-1">{isRTL ? item.product.name_ar : item.product.name_en}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs font-bold text-gray-400">{item.quantity} x {item.unitPrice || item.product.retailPrice} EGP</p>
                        <p className="text-sm font-bold text-[#1C1C1C]">{item.total || ((item.unitPrice || item.product.retailPrice) * item.quantity)} EGP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-500 font-bold">
                  <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span>{subTotal} EGP</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>{isRTL ? 'خصم التاجر' : 'Dealer Discount'}</span>
                    <span>- {discount} EGP</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-[#1C1C1C] pt-3 border-t border-gray-100">
                  <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                  <span>{total} EGP</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting || !shippingAddr || !customerName || !customerPhone}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 mt-6"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    isRTL ? 'تأكيد الطلب' : 'Confirm Order'
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
