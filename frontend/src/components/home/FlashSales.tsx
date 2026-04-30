import { useTranslation } from 'react-i18next';
import { Package, TrendingUp, ChevronRight, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

const FlashSales = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { settings } = useSettings();

  const wholesaleOffers = settings.homepage_wholesale || [];

  if (!wholesaleOffers || wholesaleOffers.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold mb-3">
              <Boxes size={20} />
              <span className="uppercase tracking-wider">{isRTL ? 'فرص استثمارية للتجار' : 'Dealer Investment Opportunities'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1C]">
              {isRTL ? 'عروض الجملة الحصرية' : 'Exclusive Wholesale Offers'}
            </h2>
          </div>
          
          <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <TrendingUp size={24} className="text-green-600" />
            <div>
              <p className="text-xs font-bold text-gray-500">{isRTL ? 'إجمالي توفير التجار هذا الشهر' : 'Dealers Savings This Month'}</p>
              <p className="text-xl font-black text-[#1C1C1C]" dir="ltr">+450,000 EGP</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {wholesaleOffers.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row overflow-hidden group">
              
              {/* Image & Stock */}
              <div className="w-full sm:w-48 bg-gray-50 p-4 border-b sm:border-b-0 sm:border-r border-gray-100 flex flex-col justify-between items-center relative shrink-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary group-hover:h-2 transition-all"></div>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mix-blend-multiply rounded-xl mb-4 group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-xl mb-4 text-xs text-gray-500">No Img</div>
                )}
                <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-200 w-full text-center">
                  {product.stock}
                </span>
              </div>
              
              {/* Details */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg text-center shrink-0 ms-2">
                    <span className="block text-[10px] font-bold text-orange-600">{isRTL ? 'توفير' : 'Save'}</span>
                    <span className="block font-black text-orange-600" dir="ltr">{product.savings?.toLocaleString() || 0} ج.م</span>
                  </div>
                </div>

                {/* OE & Part Numbers */}
                <div className="flex gap-4 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-0.5">OE Number</span>
                    <span className="block font-bold text-sm text-gray-800 font-mono tracking-wider break-all">{product.oeNumber}</span>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-0.5">Part Number</span>
                    <span className="block font-bold text-sm text-gray-800 font-mono tracking-wider break-all">{product.partNumber}</span>
                  </div>
                </div>

                {/* Package Details */}
                <div className="mb-6 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Package size={16} className="text-gray-400 shrink-0" />
                    <span className="font-bold text-sm text-primary">{product.packageType}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                    {isRTL ? 'الحد الأدنى للطلب:' : 'MOQ:'} <span className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{product.moq}</span>
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-col shrink-0">
                    <span className="text-xs font-bold text-gray-400 line-through" dir="ltr">{product.oldPrice?.toLocaleString() || 0} ج.م</span>
                    <span className="text-xl font-black text-[#1C1C1C]" dir="ltr">{product.newPrice?.toLocaleString() || 0} ج.م</span>
                  </div>
                  <button className="bg-[#1C1C1C] text-white hover:bg-primary font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm">
                    {isRTL ? 'أضف لطلبية الجملة' : 'Add to Bulk Order'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/products?wholesale=true" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            {isRTL ? 'عرض كل باقات الموزعين' : 'View All Dealer Packages'}
            <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FlashSales;
