import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

const CarMakesSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const carMakes = settings.homepage_carmakes || [];
  
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);

  // Track failed images to show text fallback
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const selectedMake = carMakes.find(m => m.id === selectedMakeId);

  if (!carMakes || carMakes.length === 0) return null;

  return (
    <section className="py-12 bg-white w-full border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 relative">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1C1C1C] mb-2">
              {isRTL ? 'تسوق حسب السيارة' : 'Shop by Car Make'}
            </h2>
            <p className="text-gray-500 font-bold text-sm md:text-base">
              {isRTL ? 'ابحث عن قطع الغيار المخصصة لسيارتك بكل سهولة' : 'Find spare parts specifically for your car easily'}
            </p>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {carMakes.map((make) => (
            <button
              key={make.id}
              onClick={() => setSelectedMakeId(selectedMakeId === make.id ? null : make.id)}
              className={`w-full aspect-square bg-white border-2 ${selectedMakeId === make.id ? 'border-primary shadow-[0_10px_30px_rgba(255,102,0,0.15)] bg-primary/5' : 'border-gray-100 shadow-sm'} rounded-3xl flex flex-col items-center justify-center p-4 md:p-6 hover:border-primary/50 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group/item relative overflow-hidden`}
            >
                {/* Selection Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-primary transition-transform origin-left ${selectedMakeId === make.id ? 'scale-x-100' : 'scale-x-0'}`}></div>
                
                {!failedImages[make.id] ? (
                  <img 
                    src={make.icon || `/makes/${make.name.toLowerCase()}.png`} 
                    alt={make.name} 
                    className={`w-16 h-16 md:w-20 md:h-20 object-contain transition-transform duration-500 group-hover/item:scale-110 ${selectedMakeId === make.id ? 'opacity-100' : 'opacity-80 group-hover/item:opacity-100'}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      setFailedImages(prev => ({ ...prev, [make.id]: true }));
                    }}
                  />
                ) : (
                  <span className={`font-black text-xl transition-colors ${selectedMakeId === make.id ? 'text-primary' : 'text-gray-700 group-hover/item:text-primary'}`}>
                    {make.name}
                  </span>
                )}
                <span className={`mt-3 md:mt-4 text-sm md:text-[15px] font-bold transition-colors ${selectedMakeId === make.id ? 'text-primary' : 'text-gray-600 group-hover/item:text-gray-900'}`}>
                  {isRTL ? make.labelAr : make.name}
                </span>
              </button>
          ))}
        </div>

        {/* Selected Make Models Grid */}
        <div className={`transition-all duration-500 overflow-hidden ${selectedMake ? 'max-h-[1200px] opacity-100 mt-12' : 'max-h-0 opacity-0 mt-0'}`}>
          {selectedMake && (
            <div className="bg-[#F8F9FA] rounded-3xl p-8 border border-gray-100">
              <h3 className="text-xl md:text-2xl font-black text-[#1C1C1C] mb-8 text-center">
                {isRTL ? 'تسوق حسب نوع السيارة' : 'Shop by Car Type'}
              </h3>
              
              {selectedMake.models && selectedMake.models.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {selectedMake.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => navigate(`/products?make=${selectedMake.name}&model=${model.name}`)}
                      className="flex flex-col items-center justify-start bg-white rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                      <div className="w-full aspect-[4/3] mb-4 relative overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-2">
                        {/* Note: User should replace these with transparent PNGs (mix-blend-multiply simulates transparency for white backgrounds) */}
                        {model.image ? (
                          <img 
                            src={model.image} 
                            alt={model.name} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-lg">No Image</div>
                        )}
                      </div>
                      <span className="font-bold text-[#1C1C1C] text-[15px] text-center group-hover:text-primary transition-colors">
                        {isRTL ? model.labelAr : model.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 font-bold py-8">
                  {isRTL ? 'لا توجد موديلات مضافة لهذه الماركة حالياً.' : 'No models available for this make.'}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default CarMakesSection;
