import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

const BrandsSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { settings } = useSettings();
  const homepage_brands = settings.homepage_brands;

  if (!homepage_brands || homepage_brands.length === 0) return null;

  return (
    <section id="brands" className="py-12 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {homepage_brands.map((brand) => (
            <div
              key={brand.id}
              className={`rounded-3xl ${brand.bgColor || 'bg-gray-100'} overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 h-[240px] flex items-center`}
              onClick={() => navigate(`/products?query=${brand.logoText}`)}
              dir={isRTL ? "rtl" : "ltr"}
            >
              
              {/* Background Image (Full Width) */}
              <div className="absolute inset-0 z-0">
                {brand.imgUrl && (
                  <img
                    src={brand.imgUrl}
                    alt={brand.logoText}
                    className={`w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-700 group-hover:scale-110`}
                  />
                )}
              </div>

              {/* Gradient Overlay (Fades image into background color) */}
              {/* We extract the hex color from bg-[...] class if possible to build the gradient, or fallback to a default dark/light gradient */}
              <div className={`absolute inset-0 z-10 w-full h-full ${
                isRTL 
                  ? 'bg-gradient-to-l from-white/90 via-white/80 to-transparent' 
                  : 'bg-gradient-to-r from-white/90 via-white/80 to-transparent'
                }`} 
                style={{ mixBlendMode: 'overlay' }}
              ></div>
              {/* A secondary solid gradient using the same background color for seamless fade */}
              <div className={`absolute inset-0 z-10 w-full h-full ${brand.bgColor || 'bg-white'} opacity-90`}
                style={{
                  maskImage: `linear-gradient(to ${isRTL ? 'left' : 'right'}, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)`,
                  WebkitMaskImage: `linear-gradient(to ${isRTL ? 'left' : 'right'}, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)`
                }}
              ></div>

              {/* Content Box */}
              <div className="relative z-20 flex flex-col justify-center h-full p-6 w-[65%] shrink-0">
                
                <div className="mb-4">
                  {/* Brand Logo */}
                  {brand.logoUrl ? (
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.logoText} 
                      className="h-10 md:h-12 object-contain mb-3 drop-shadow-sm" 
                    />
                  ) : (
                    <div className={`w-fit text-3xl font-black ${brand.logoColor || 'text-gray-900'} mb-3 border-[2.5px] border-current rounded-full px-5 py-1 inline-flex items-center justify-center bg-white/50 backdrop-blur-sm`} dir="ltr">
                      {brand.logoText}
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1C1C1C] text-[16px] leading-relaxed drop-shadow-sm">
                      {isRTL ? brand.taglineAr : brand.taglineEn}
                    </span>
                    <span className="font-bold text-gray-600 text-[14px] leading-snug drop-shadow-sm">
                      {isRTL ? brand.descAr : brand.descEn}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  className={`${brand.btnColor || 'bg-gray-900'} text-white font-bold text-sm py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-fit shadow-md`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products?query=${brand.logoText}`);
                  }}
                >
                  {isRTL ? 'استعرض المنتجات' : 'Browse Products'}
                  {isRTL ? <ArrowLeft size={16} className="mt-0.5" /> : <ArrowRight size={16} className="mt-0.5" />}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Carousel Indicators (Mock for aesthetics) */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
