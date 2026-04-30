import { useTranslation } from 'react-i18next';
import { Search, PackageSearch, FileText, MapPin } from 'lucide-react';

const steps = [
  { 
    Icon: Search, 
    num: '01', 
    title: 'ابحث عن القطعة',
    desc: 'ابحث برقم القطعة أو اسم المنتج',
  },
  { 
    Icon: PackageSearch, 
    num: '02', 
    title: 'اختر المنتج',
    desc: 'اختر المنتج المناسب لسيارتك',
  },
  { 
    Icon: FileText, 
    num: '03', 
    title: 'اطلع على المواصفات',
    desc: 'اقرأ المواصفات وتأكد من التوافق',
  },
  { 
    Icon: MapPin, 
    num: '04', 
    title: 'اعثر على أقرب تاجر',
    desc: 'نحدد لك أقرب تاجر لموقعك بسهولة',
  },
];

const HowItWorks = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-[#1C1C1C]">
            {isRTL ? 'كيف يعمل الموقع؟' : 'How it works?'}
          </h2>
        </div>

        <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
          {/* Connector line */}
          <div className="absolute top-4 start-0 w-full h-[2px] bg-gray-200 hidden md:block z-0"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {steps.map(({ Icon, num, title, desc }) => (
              <div key={num} className="relative text-center flex flex-col items-center">
                
                {/* Number Circle on the line */}
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mb-6 shadow-[0_0_0_6px_white]">
                  {num}
                </div>

                {/* Icon */}
                <div className="text-[#1C1C1C] mb-5">
                  <Icon size={42} strokeWidth={1} />
                </div>

                {/* Text */}
                <div className="font-black text-[#1C1C1C] text-[17px] mb-2">
                  {title}
                </div>
                <p className="text-gray-500 text-[13px] leading-relaxed max-w-[200px] mx-auto font-medium">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
