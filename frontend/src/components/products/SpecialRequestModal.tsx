import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, Send, FileWarning } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SpecialRequestModal = ({ isOpen, onClose }: Props) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [partName, setPartName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName || !customerPhone) return;

    const adminPhone = "201000000000"; // Fake Admin Phone
    let text = isRTL 
      ? `مرحباً الإدارة،\nلدي طلب لقطعة غير متوفرة في الموقع:\n\nالقطعة المطلوبة: ${partName}\nالسيارة: ${carModel || 'غير محدد'}\nجوال التواصل: ${customerPhone}\n\nالرجاء توفيرها لي.`
      : `Hello Admin,\nI have a special request for a part not found on the site:\n\nPart: ${partName}\nCar: ${carModel || 'Not specified'}\nPhone: ${customerPhone}\n\nPlease provide it.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${adminPhone}?text=${encodedText}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1C1F2A] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <FileWarning size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-black text-lg">{isRTL ? 'طلب قطعة خاصة' : 'Special Part Request'}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{isRTL ? 'لم تجد قطعتك؟ نحن نوفرها لك' : 'Can\'t find it? We\'ll get it for you'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'اسم القطعة أو رقمها' : 'Part Name or Number'} *</label>
            <input 
              required
              type="text" 
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder={isRTL ? 'مثال: كمبروسر تكييف دينسو' : 'e.g. Denso AC Compressor'}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'السيارة (اختياري)' : 'Car (Optional)'}</label>
              <input 
                type="text" 
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                placeholder={isRTL ? 'مثال: كامري 2024' : 'e.g. Camry 2024'}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'رقم الجوال للتواصل' : 'Contact Phone'} *</label>
              <input 
                required
                type="tel" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'صورة القطعة (اختياري لتسريع البحث)' : 'Part Photo (Optional)'}</label>
            <button type="button" className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer">
              <Camera size={28} />
              <span className="text-sm font-bold">{isRTL ? 'اضغط لرفع صورة القطعة القديمة' : 'Click to upload old part photo'}</span>
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20 mt-2"
          >
            <Send size={18} className={isRTL ? 'rotate-180' : ''} />
            {isRTL ? 'إرسال الطلب للإدارة' : 'Send Request to Admin'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default SpecialRequestModal;
