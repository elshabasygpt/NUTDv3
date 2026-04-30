import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { MapPin, Phone, User, Car, CheckCircle2, MessageCircle, Award, Zap, Wrench } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MOCK_DEALERS = [
  { id: '1', name: '010 1234 5678 (كيمو ستور)', phone: '201012345678', distance: '2.4 كم', badges: ['premium', 'fast'] },
  { id: '2', name: 'الشركة الهندسية لقطع الغيار', phone: '201123456789', distance: '4.7 كم', badges: ['installation'] },
  { id: '3', name: 'مؤسسة التوفيق للتجارة', phone: '201234567890', distance: '6.1 كم', badges: [] },
];

const renderBadge = (badge: string) => {
  switch (badge) {
    case 'premium':
      return <div key={badge} className="flex items-center gap-1 bg-[#FFB300]/10 text-[#FFB300] px-2 py-0.5 rounded text-[10px] font-bold border border-[#FFB300]/20"><Award size={12} /> معتمد ذهبي</div>;
    case 'fast':
      return <div key={badge} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100"><Zap size={12} /> استجابة سريعة</div>;
    case 'installation':
      return <div key={badge} className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold border border-green-100"><Wrench size={12} /> يتوفر تركيب</div>;
    default:
      return null;
  }
};

const QuoteCheckoutPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [carDetails, setCarDetails] = useState('');
  const [selectedDealerId, setSelectedDealerId] = useState<string>('1');

  const selectedDealer = useMemo(() => MOCK_DEALERS.find(d => d.id === selectedDealerId), [selectedDealerId]);

  const handleWhatsAppSend = () => {
    if (!customerName || !customerPhone || !selectedDealer) {
      alert(isRTL ? 'يرجى إكمال بياناتك واختيار تاجر' : 'Please complete your details and select a dealer');
      return;
    }

    let text = isRTL 
      ? `مرحباً، أود الاستفسار عن تسعير قطع الغيار التالية:\n\n`
      : `Hello, I would like to request a quote for the following parts:\n\n`;

    items.forEach((item, index) => {
      text += `${index + 1}. ${isRTL ? item.product.name_ar : item.product.name_en} (رقم القطعة: ${item.product.partNumber}) - الكمية: ${item.quantity}\n`;
    });

    text += isRTL
      ? `\n\nبياناتي:\nالاسم: ${customerName}\nالجوال: ${customerPhone}\nالسيارة: ${carDetails || 'غير محدد'}\n\nمرسل عبر منصة NUTD`
      : `\n\nMy Details:\nName: ${customerName}\nPhone: ${customerPhone}\nCar: ${carDetails || 'Not specified'}\n\nSent via NUTD Platform`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${selectedDealer.phone}?text=${encodedText}`;

    // If dealer, also save to database
    if (user?.role === 'DEALER') {
      const total = items.reduce((sum, item) => sum + (item.price || item.product.retailPrice) * item.quantity, 0);
      api.post('/orders', {
        total,
        subTotal: total,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price || item.product.retailPrice
        }))
      }).catch(err => console.error('Failed to save order to db', err));
    }

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Clear cart and redirect
    clearCart();
    navigate(user?.role === 'DEALER' ? '/dealer/orders' : '/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-[#F8F9FA]" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-black text-[#1C1C1C]">{isRTL ? 'قائمة طلباتك فارغة' : 'Your quote request is empty'}</h2>
        <button onClick={() => navigate('/products')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-sm">
          {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-4">
            {isRTL ? 'إتمام طلب التسعير' : 'Complete Quote Request'}
          </h1>
          <p className="text-gray-500 font-bold text-lg">
            {isRTL 
              ? 'سيتم إرسال طلبك مباشرة إلى التاجر المعتمد الذي تختاره عبر الواتساب لتسعيره وتجهيزه لك.' 
              : 'Your request will be sent directly via WhatsApp to your selected authorized dealer for pricing and fulfillment.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Right Side / Form */}
          <div className="flex-1 space-y-6">
            
            {/* 1. Customer Details */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#1C1C1C] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">1</span>
                {isRTL ? 'بيانات التواصل' : 'Contact Details'}
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
                    placeholder={isRTL ? 'رقم الجوال (للتواصل)' : 'Phone Number'}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 ps-12 pe-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                    <Car size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder={isRTL ? 'نوع وموديل السيارة (اختياري، مثلاً: تويوتا كامري 2024)' : 'Car Make & Model (Optional)'}
                    value={carDetails}
                    onChange={(e) => setCarDetails(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 ps-12 pe-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Dealer Selection */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#1C1C1C] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">2</span>
                {isRTL ? 'اختر التاجر المعتمد للتنفيذ' : 'Select Authorized Dealer'}
              </h2>

              <div className="space-y-3">
                {MOCK_DEALERS.map((dealer) => (
                  <div 
                    key={dealer.id}
                    onClick={() => setSelectedDealerId(dealer.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                      selectedDealerId === dealer.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-100 hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedDealerId === dealer.id ? 'border-primary bg-primary' : 'border-gray-300'
                    }`}>
                      {selectedDealerId === dealer.id && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1C1C1C] flex items-center gap-2">
                        {dealer.name}
                      </h4>
                      {dealer.badges && dealer.badges.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 mb-1">
                          {dealer.badges.map(renderBadge)}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 font-bold mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {isRTL ? 'يبعد عنك' : 'Distance'}: {dealer.distance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Left Side / Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-black text-[#1C1C1C] mb-6 border-b border-gray-100 pb-4">
                {isRTL ? 'ملخص القطع المطلوبة' : 'Requested Parts Summary'}
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
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-[#1C1C1C] line-clamp-1">{isRTL ? item.product.name_ar : item.product.name_en}</h4>
                      <p className="text-xs font-bold text-gray-400 mt-1">{item.product.partNumber}</p>
                      <p className="text-xs font-bold text-primary mt-1">{isRTL ? 'الكمية:' : 'Qty:'} {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <button 
                  onClick={handleWhatsAppSend}
                  disabled={!customerName || !customerPhone}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle size={20} />
                  {isRTL ? 'إرسال الطلب عبر واتساب للتاجر' : 'Send Request via WhatsApp'}
                </button>
                <p className="text-center text-[11px] text-gray-400 font-bold mt-4">
                  {isRTL ? 'لا يتم دفع أي مبالغ الآن، الدفع يكون عند استلام القطع من التاجر.' : 'No payment is required now, payment is made upon receipt from the dealer.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuoteCheckoutPage;
