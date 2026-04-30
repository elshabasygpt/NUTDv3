import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
}

const CustomSelect = ({ value, onChange, options, placeholder, disabled, searchable }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-[13px] md:text-sm font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors h-[54px]"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon && (
            <img 
              src={selectedOption.icon} 
              alt={selectedOption.label} 
              className="w-6 h-6 object-contain shrink-0" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown size={18} strokeWidth={2.5} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} shrink-0`} />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 max-h-[280px] flex flex-col transition-all duration-200 origin-top ${isOpen && !disabled ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {searchable && (
          <div className="p-3 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="relative">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="ابحث هنا..." 
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 ps-9 pe-3 text-xs font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
        )}
        <div className="overflow-y-auto py-2 flex-1">
          {options.filter(opt => opt.label.toLowerCase().includes(internalSearch.toLowerCase())).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 text-[14px] font-bold transition-colors ${value === opt.value ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-3">
              {opt.icon && (
                <div className="w-8 h-8 bg-white rounded-full border border-gray-100 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden">
                  <img 
                    src={opt.icon} 
                    alt={opt.label} 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                      // Hide the image and its parent circle if it fails to load
                      const parent = e.currentTarget.parentElement;
                      if (parent) parent.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <span>{opt.label}</span>
            </div>
            {value === opt.value && <Check size={18} strokeWidth={2.5} className="text-primary" />}
          </button>
        ))}
        {options.filter(opt => opt.label.toLowerCase().includes(internalSearch.toLowerCase())).length === 0 && (
          <div className="p-4 text-center text-sm font-bold text-gray-500">لا توجد نتائج</div>
        )}
        </div>
      </div>
    </div>
  );
};


import { useSettings } from '../../contexts/SettingsContext';

const HeroSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { settings } = useSettings();
  const heroSettings = settings.homepage_hero;
  
  const [query, setQuery] = useState('');
  const [partType, setPartType] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = heroSettings?.slides || [
    { id: 1, image: '/hero/slide_1.png' },
    { id: 2, image: '/hero/slide_2.png' },
    { id: 3, image: '/hero/slide_3.png' },
  ];

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const saved = localStorage.getItem('myGarage');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.make) setMake(parsed.make);
        if (parsed.model) setModel(parsed.model);
        if (parsed.year) setYear(parsed.year);
        if (parsed.engine) setEngine(parsed.engine);
      } catch (e) {
        console.error('Failed to parse myGarage data', e);
      }
    }
  }, []);

  const makes: Option[] = heroSettings?.makes 
    ? heroSettings.makes.map(m => ({ value: m.value, label: isRTL ? m.labelAr : m.labelEn, icon: m.icon }))
    : [
        { value: 'Toyota', label: isRTL ? 'تويوتا' : 'Toyota', icon: '/makes/toyota.png' },
        { value: 'Hyundai', label: isRTL ? 'هيونداي' : 'Hyundai', icon: '/makes/hyundai.png' },
        { value: 'Kia', label: isRTL ? 'كيا' : 'Kia', icon: '/makes/kia.png' },
        { value: 'Nissan', label: isRTL ? 'نيسان' : 'Nissan', icon: '/makes/nissan.png' },
        { value: 'Honda', label: isRTL ? 'هوندا' : 'Honda', icon: '/makes/honda.png' },
      ];
  
  const models: Option[] = (heroSettings?.models || ['Camry', 'Corolla', 'Elantra', 'Accent']).map(m => ({ value: m, label: m }));
  const years: Option[] = (heroSettings?.years || ['2024', '2023', '2022', '2021', '2020', '2019']).map(y => ({ value: y, label: y }));
  const engines: Option[] = (heroSettings?.engines || ['1.6L', '2.0L', '2.4L', '2.5L', '3.5L V6']).map(e => ({ value: e, label: e }));
  
  const partTypes: Option[] = (heroSettings?.partTypes || [
    'تيل فرامل', 'فلتر زيت', 'فلتر هواء', 'مساعدين', 'مقصات', 'بوجيهات', 'سير تقسيمة', 'طرمبة بنزين', 'طنابير', 'كومبريسور'
  ]).map(p => ({ value: p, label: p }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (partType) params.set('type', partType);
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (engine) params.set('engine', engine);

    // Save to My Garage
    if (make) {
       localStorage.setItem('myGarage', JSON.stringify({ make, model, year, engine }));
       window.dispatchEvent(new Event('garageUpdated'));
    }

    navigate(`/products?${params.toString()}`);
  };

  return (
    <section className="relative bg-[#F8F9FA] min-h-[550px] md:min-h-[600px] flex items-center w-full z-10">
      
      {/* Background Image Container with Overflow Hidden (Slider) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 bottom-0 left-0 w-full lg:w-[60%] h-full z-0 hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F8F9FA]/20 to-[#F8F9FA] z-10" />
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10" />
          
          {slides.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-left transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            />
          ))}

          {/* Slider Dots */}
          <div className="absolute bottom-8 left-12 z-20 flex gap-2" dir="ltr">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 pointer-events-auto ${
                  index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex justify-start">
        
        <div className="w-full lg:w-[65%] xl:w-[70%] flex flex-col py-16">
          
          <h1 
            className="text-4xl md:text-5xl lg:text-7xl font-black text-[#1C1C1C] leading-[1.2] mb-6 tracking-tight"
            dangerouslySetInnerHTML={{ __html: isRTL 
              ? (heroSettings?.titleAr || "الشريك <span class='text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'>الاستراتيجي</span><br /><span class='text-primary'>لتجار قطع الغيار في مصر</span>") 
              : (heroSettings?.titleEn || "The <span class='text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'>Strategic Partner</span><br /><span class='text-primary'>For Auto Parts Dealers</span>") 
            }}
          />
          <p 
            className="text-gray-600 font-bold text-lg mb-10 leading-relaxed max-w-xl"
            dangerouslySetInnerHTML={{ __html: isRTL 
              ? (heroSettings?.subtitleAr || 'نوفر لك أفضل العلامات التجارية بأسعار الجملة التنافسية وبمخزون ضخم يلبي احتياجات متجرك.') 
              : (heroSettings?.subtitleEn || 'We provide top global brands at competitive wholesale prices with massive stock to fulfill your store needs.') 
            }}
          />

          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-full relative z-20 border border-white">
            
            <div className="flex mb-4 relative">
              <input
                type="text"
                placeholder={isRTL ? 'ابحث برقم القطعة أو اسم المنتج...' : 'Search by part number or product name...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl px-6 py-5 text-base md:text-[17px] font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all pe-20 shadow-inner"
              />
              <button
                onClick={handleSearch}
                className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-2 bottom-2 aspect-square bg-primary text-white rounded-xl hover:bg-primary-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5`}
              >
                <Search size={26} strokeWidth={2.5} />
              </button>
            </div>

            {/* Bottom Row: 5 Custom Dropdowns (Vehicle Selector) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
              <CustomSelect 
                value={make} 
                onChange={(v) => { setMake(v); setModel(''); setYear(''); setEngine(''); }} 
                options={makes} 
                placeholder={isRTL ? 'الشركة المصنعة' : 'Make'} 
                searchable={true}
              />
              <CustomSelect 
                value={model} 
                onChange={(v) => { setModel(v); setYear(''); setEngine(''); }} 
                options={models} 
                placeholder={isRTL ? 'الموديل' : 'Model'} 
                disabled={!make} 
                searchable={true}
              />
              <CustomSelect 
                value={year} 
                onChange={(v) => { setYear(v); setEngine(''); }} 
                options={years} 
                placeholder={isRTL ? 'السنة' : 'Year'} 
                disabled={!model} 
              />
              <CustomSelect 
                value={engine} 
                onChange={setEngine} 
                options={engines} 
                placeholder={isRTL ? 'المحرك' : 'Engine'} 
                disabled={!year} 
              />
              <CustomSelect 
                value={partType} 
                onChange={setPartType} 
                options={partTypes} 
                placeholder={isRTL ? 'نوع القطعة' : 'Part Type'} 
                searchable={true}
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
