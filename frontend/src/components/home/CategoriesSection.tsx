import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

const CategoriesSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const categories = settings.homepage_categories || [];
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    // If we have subcategories for this, expand it. Otherwise navigate.
    if (cat && cat.subcategories && cat.subcategories.length > 0) {
      setSelectedCategory(selectedCategory === catId ? null : catId);
    } else {
      navigate(`/products?category=${catId}`);
    }
  };

  const selectedCatObj = categories.find(c => c.id === selectedCategory);
  const currentSubCats = selectedCatObj ? (selectedCatObj.subcategories || []) : [];

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-[#F8F9FA] w-full">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-4 tracking-tight">
            {isRTL ? 'تسوق حسب فئة القطع' : 'Shop by Category'}
          </h2>
          <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'تصفح أقسامنا المتنوعة للوصول إلى قطعة الغيار التي تبحث عنها بسرعة ودقة' 
              : 'Browse our various categories to quickly and accurately find the spare part you need'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const isMobileRowEnd = index % 2 === 1 || index === categories.length - 1;
            const isDesktopRowEnd = index % 4 === 3 || index === categories.length - 1;

            const pairStartIndex = Math.floor(index / 2) * 2;
            const quadStartIndex = Math.floor(index / 4) * 4;

            const selectedInPair = selectedCategory && categories.slice(pairStartIndex, pairStartIndex + 2).some(c => c.id === selectedCategory);
            const selectedInQuad = selectedCategory && categories.slice(quadStartIndex, quadStartIndex + 4).some(c => c.id === selectedCategory);

            const ExpanderContent = () => (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-2 mb-4 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                  {currentSubCats.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => navigate(`/products?category=${selectedCategory}&subcategory=${sub.id}`)}
                      className="flex flex-col items-center group w-28 md:w-40"
                    >
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-gray-100 shadow-sm bg-white mb-3 md:mb-4 flex items-center justify-center overflow-hidden p-3 md:p-4 group-hover:border-primary group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-2">
                        {sub.image ? (
                          <img 
                            src={sub.image} 
                            alt={sub.nameEN} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400 rounded-full">No Img</div>
                        )}
                      </div>
                      <span className="font-bold text-[#1C1C1C] text-[13px] md:text-[15px] text-center group-hover:text-primary transition-colors leading-tight">
                        {isRTL ? sub.nameAR : sub.nameEN}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );

            return (
              <React.Fragment key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group bg-white rounded-3xl p-6 flex flex-col items-center justify-center border transition-all duration-300 relative overflow-hidden ${selectedCategory === cat.id ? 'border-primary shadow-[0_8px_30px_rgb(0,0,0,0.08)]' : 'border-gray-100 shadow-sm hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1'}`}
                >
                  {/* Selection Indicator */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-primary transition-transform origin-left ${selectedCategory === cat.id ? 'scale-x-100' : 'scale-x-0'}`}></div>

                  <div className={`w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-5 relative flex items-center justify-center rounded-2xl overflow-hidden p-2 transition-colors ${selectedCategory === cat.id ? 'bg-orange-50' : 'bg-gray-50/50'}`}>
                    {cat.image ? (
                      <img 
                        src={cat.image} 
                        alt={cat.nameEN} 
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-xl">No Img</div>
                    )}
                  </div>
                  <span className={`font-bold text-center text-[14px] md:text-[16px] transition-colors ${selectedCategory === cat.id ? 'text-primary' : 'text-[#1C1C1C] group-hover:text-primary'}`}>
                    {isRTL ? cat.nameAR : cat.nameEN}
                  </span>
                </button>

                {/* Mobile Expander Injection */}
                {isMobileRowEnd && selectedInPair && (
                  <div className="col-span-2 md:hidden">
                    <ExpanderContent />
                  </div>
                )}

                {/* Desktop Expander Injection */}
                {isDesktopRowEnd && selectedInQuad && (
                  <div className="hidden md:block col-span-4">
                    <ExpanderContent />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;
