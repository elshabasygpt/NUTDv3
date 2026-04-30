import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Package, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || 'ORD-XXXX';

  return (
    <div className="min-h-[80vh] bg-[#F8F9FA] flex items-center justify-center py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        
        <div className="w-24 h-24 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-black text-[#1C1C1C] mb-4">
          {isRTL ? 'تم استلام طلبك بنجاح!' : 'Order Placed Successfully!'}
        </h1>
        
        <p className="text-gray-500 font-bold mb-8">
          {isRTL 
            ? 'شكراً لك. فريق المبيعات سيقوم بمراجعة طلبك وتجهيزه بأسرع وقت ممكن.' 
            : 'Thank you. Our sales team will review and process your order as soon as possible.'}
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <Package className="text-gray-400" />
          <div className="text-start">
            <p className="text-xs text-gray-500 font-bold">{isRTL ? 'رقم الطلب' : 'Order Number'}</p>
            <p className="text-lg font-black text-[#1C1C1C]">{orderId}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/dealer/orders')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isRTL ? 'تتبع طلباتي' : 'Track My Orders'}
            {isRTL ? <ChevronRight size={18} className="rotate-180" /> : <ChevronRight size={18} />}
          </button>
          
          <button 
            onClick={() => navigate('/products')}
            className="w-full bg-white hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {isRTL ? 'العودة للتسوق' : 'Return to Shop'}
            {isRTL ? <ArrowRight size={18} /> : <ArrowRight size={18} className="rotate-180" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
