import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Zap, Wrench, ChevronLeft, Building2 } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const renderBadge = (badge: string) => {
  switch (badge) {
    case 'premium':
      return <div key={badge} className="flex items-center gap-1 bg-[#FFB300]/10 text-[#FFB300] px-2 py-1 rounded text-xs font-bold border border-[#FFB300]/20"><Award size={14} /> معتمد ذهبي</div>;
    case 'fast':
      return <div key={badge} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold border border-blue-100"><Zap size={14} /> استجابة سريعة</div>;
    case 'installation':
      return <div key={badge} className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold border border-green-100"><Wrench size={14} /> يتوفر تركيب</div>;
    default:
      return null;
  }
};

const PremiumDealers = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { settings } = useSettings();

  const dealers = settings.homepage_dealers || [];

  if (!dealers || dealers.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-4 flex items-center gap-3">
              <Award className="text-[#FFB300]" size={36} />
              {isRTL ? 'موزعينا المعتمدين' : 'Premium Authorized Dealers'}
            </h2>
            <p className="text-gray-500 font-bold max-w-2xl text-lg">
              {isRTL 
                ? 'تعامل مع نخبة من أفضل الموزعين المعتمدين في السوق، ضمان الجودة، سرعة الاستجابة، وأسعار لا تقبل المنافسة.' 
                : 'Deal with the elite authorized distributors in the market, ensuring quality, fast response, and unbeatable prices.'}
            </p>
          </div>
          <Link to="/dealers" className="bg-gray-50 hover:bg-gray-100 text-[#1C1C1C] font-bold px-6 py-3 rounded-xl transition-colors border border-gray-200 flex items-center gap-2 shrink-0">
            {isRTL ? 'عرض جميع الموزعين' : 'View All Dealers'}
            <ChevronLeft size={18} className={isRTL ? '' : 'rotate-180'} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealers.map((dealer) => (
            <div key={dealer.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full">
              
              {/* Header: Logo & Rating */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shadow-inner overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  {dealer.logo ? (
                    <img src={dealer.logo} alt={dealer.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building2 size={28} className="text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-[#FFB300]/10 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-[#FFB300] fill-current" />
                    <span className="font-bold text-[#FFB300] text-sm">{dealer.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-bold mt-1">({dealer.reviews} {isRTL ? 'تقييم' : 'Reviews'})</span>
                </div>
              </div>

              {/* Body: Name & Location */}
              <div className="mb-6 flex-1">
                <h3 className="text-xl font-black text-[#1C1C1C] mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {dealer.name}
                </h3>
                <p className="text-gray-500 font-medium text-sm flex items-center gap-1.5">
                  <MapPin size={16} className="text-gray-400" />
                  {dealer.location}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {dealer.badges.map(renderBadge)}
              </div>

              {/* Action */}
              <Link to={`/products?dealer=${dealer.id}`} className="w-full bg-[#1C1F2A] hover:bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors mt-auto">
                {isRTL ? 'تصفح أسعار الموزع' : 'Browse Dealer Prices'}
              </Link>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PremiumDealers;
