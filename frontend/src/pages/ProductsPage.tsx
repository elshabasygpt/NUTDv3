import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, LayoutGrid, List, SlidersHorizontal, Heart, ChevronLeft, ChevronDown, Check, ShoppingCart, HelpCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import SpecialRequestModal from '../components/products/SpecialRequestModal';
import { getProducts } from '../services/api';
import type { Product } from '../types';
import SEO from '../components/seo/SEO';

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
}

const CustomSelect = ({ value, onChange, options, placeholder, disabled }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className={`relative mb-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none shadow-sm cursor-pointer flex items-center justify-between transition-colors h-[42px] ${isOpen ? 'border-primary ring-1 ring-primary' : 'border-gray-200 text-gray-500'}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {selectedOption?.icon && (
            <img 
              src={selectedOption.icon} 
              alt={selectedOption.label} 
              className="w-5 h-5 object-contain shrink-0" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="truncate text-gray-700">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown size={16} strokeWidth={2.5} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} shrink-0`} />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 max-h-[200px] overflow-y-auto py-2 transition-all duration-200 origin-top ${isOpen && !disabled ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold transition-colors ${value === opt.value ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-3">
              {opt.icon && (
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                  <img 
                    src={opt.icon} 
                    alt={opt.label} 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) parent.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <span>{opt.label}</span>
            </div>
            {value === opt.value && <Check size={16} strokeWidth={2.5} className="text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full animate-pulse">
    <div className="relative aspect-square p-6 flex items-center justify-center bg-gray-50 border-b border-gray-100">
      <div className="w-3/4 h-3/4 bg-gray-200 rounded-xl"></div>
    </div>
    <div className="p-5 flex flex-col flex-1 text-center bg-white">
      <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto mb-4"></div>
      <div className="h-3 bg-gray-200 rounded-full w-1/3 mx-auto mb-6"></div>
      <div className="mt-auto">
        <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

const BRANDS = [
  { name: 'Borsehung', count: 45, color: '#006B3F' }, 
  { name: 'Vika', count: 42, color: '#0033A0' },
  { name: 'KDD', count: 33, color: '#E3000F' },
];

const CATEGORIES = [
  { 
    id: 'Brakes', labelAR: 'نظام الفرامل', labelEN: 'Brakes', count: 28,
    image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=150',
    subCategories: [
      { id: 'Brake_Pads', labelAR: 'تيل فرامل', labelEN: 'Brake Pads', count: 12 },
      { id: 'Brake_Discs', labelAR: 'طنابير', labelEN: 'Brake Discs', count: 10 },
      { id: 'Brake_Calipers', labelAR: 'كاليبر فرامل', labelEN: 'Brake Calipers', count: 6 },
    ]
  },
  { 
    id: 'Suspension', labelAR: 'نظام التعليق', labelEN: 'Suspension', count: 24,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=150',
    subCategories: [
      { id: 'Shock_Absorbers', labelAR: 'مساعدين', labelEN: 'Shock Absorbers', count: 10 },
      { id: 'Control_Arms', labelAR: 'مقصات', labelEN: 'Control Arms', count: 8 },
      { id: 'Stabilizers', labelAR: 'ميزان', labelEN: 'Stabilizer Links', count: 6 },
    ]
  },
  { 
    id: 'Engine', labelAR: 'المحرك', labelEN: 'Engine', count: 18,
    image: 'https://images.unsplash.com/photo-1503376710356-6f8e437011d8?auto=format&fit=crop&q=80&w=150',
    subCategories: [
      { id: 'Filters', labelAR: 'فلاتر', labelEN: 'Filters', count: 10 },
      { id: 'Belts', labelAR: 'سيور', labelEN: 'Belts', count: 4 },
      { id: 'Pistons', labelAR: 'بساتم', labelEN: 'Pistons', count: 4 },
    ]
  },
  { 
    id: 'Electrical', labelAR: 'كهرباء وإضاءة', labelEN: 'Electrical', count: 16,
    image: 'https://images.unsplash.com/photo-1606524177742-b062b9a7b93a?auto=format&fit=crop&q=80&w=150',
    subCategories: [
      { id: 'Headlights', labelAR: 'فوانيس', labelEN: 'Headlights', count: 8 },
      { id: 'Sensors', labelAR: 'حساسات', labelEN: 'Sensors', count: 8 },
    ]
  },
];

const ProductsPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [specialRequestOpen, setSpecialRequestOpen] = useState(false);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? [searchParams.get('brand')!] : []
  );
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [priceMax] = useState(1000);
  const [sortBy, setSortBy] = useState('popular');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const [expandedCats, setExpandedCats] = useState<string[]>(['Brakes']);

  const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || '');
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedEngine, setSelectedEngine] = useState(searchParams.get('engine') || '');

  const [isLoading, setIsLoading] = useState(false);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getProducts({ 
        query, 
        brand: selectedBrands.join(','), 
        category: selectedCats.join(','),
        page,
        limit: 12
      });
      setApiProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.total || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [query, selectedBrands, selectedCats]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getDealerPrice = (price: number) => {
    if (user?.role === 'DEALER' && user.dealerProfile?.discountRate) {
      return price * (1 - user.dealerProfile.discountRate / 100);
    }
    return price;
  };

  const filtered = useMemo(() => {
    let items = apiProducts;
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(p => 
        p.partNumber.toLowerCase().includes(q) || 
        p.name_en.toLowerCase().includes(q) ||
        p.name_ar.includes(q)
      );
    }
    if (selectedBrands.length) items = items.filter(p => selectedBrands.includes(p.brand));
    if (selectedCats.length) items = items.filter(p => selectedCats.includes(p.category));
    return items;
  }, [apiProducts, query, selectedBrands, selectedCats, priceMax, sortBy]);

  const toggleBrand = (b: string) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleCat = (c: string) => setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleExpandCat = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const makes: Option[] = [
    { value: 'toyota', label: isRTL ? 'تويوتا' : 'Toyota', icon: '/makes/toyota.png' },
    { value: 'skoda', label: isRTL ? 'سكودا' : 'Skoda', icon: '/makes/skoda.png' },
    { value: 'hyundai', label: isRTL ? 'هيونداي' : 'Hyundai', icon: '/makes/hyundai.png' },
    { value: 'kia', label: isRTL ? 'كيا' : 'Kia', icon: '/makes/kia.png' },
    { value: 'nissan', label: isRTL ? 'نيسان' : 'Nissan', icon: '/makes/nissan.png' },
    { value: 'honda', label: isRTL ? 'هوندا' : 'Honda', icon: '/makes/honda.png' },
  ];

  let modelsList: string[] = [];
  if (selectedMake === 'toyota') modelsList = ['Camry', 'Corolla'];
  if (selectedMake === 'skoda') modelsList = ['Octavia', 'Superb'];
  if (selectedMake === 'hyundai') modelsList = ['Elantra', 'Tucson'];
  if (selectedMake === 'kia') modelsList = ['Cerato', 'Sportage'];
  if (selectedMake === 'nissan') modelsList = ['Sunny', 'Sentra'];
  if (selectedMake === 'honda') modelsList = ['Civic', 'Accord'];

  const models: Option[] = modelsList.map(m => ({ value: m.toLowerCase(), label: m }));
  const years: Option[] = ['2024', '2023', '2022', '2021', '2020'].map(y => ({ value: y, label: y }));
  const engines: Option[] = ['1.6L', '2.0L', '2.5L'].map(e => ({ value: e, label: e }));

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-cairo" dir={isRTL ? "rtl" : "ltr"}>
      <SEO title={isRTL ? 'المنتجات' : 'Products'} />
      <div className="bg-[#F8F9FA] py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-400">{isRTL ? 'المنتجات' : 'Products'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1C1C1C] mb-2">{isRTL ? 'المنتجات' : 'Products'}</h1>
          <p className="text-gray-500 font-bold">{isRTL ? 'تصفح مجموعة واسعة من قطع غيار السيارات عالية الجودة من أفضل العلامات التجارية.' : 'Browse a wide range of high-quality auto parts from top brands.'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className={`w-full lg:w-72 shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24 self-start ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <SlidersHorizontal size={20} className="text-[#1C1C1C]" />
              <h3 className="font-black text-[#1C1C1C] text-lg">{isRTL ? 'تصفية النتائج' : 'Filter Results'}</h3>
            </div>
            <div className="mb-6">
              <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'بحث سريع' : 'Quick Search'}</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isRTL ? 'ابحث برقم القطعة...' : 'Search by part number...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm pe-10"
                />
                <Search size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'التوكيل' : 'Brand'}</h4>
              <div className="space-y-3">
                {BRANDS.map(brand => (
                  <label key={brand.name} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded cursor-pointer checked:bg-primary checked:border-primary transition-all"
                        />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">{brand.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">({brand.count})</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'الشركة المصنعة' : 'Car Make'}</h4>
              <CustomSelect 
                value={selectedMake} 
                onChange={(v) => { setSelectedMake(v); setSelectedModel(''); setSelectedYear(''); setSelectedEngine(''); }} 
                options={makes} 
                placeholder={isRTL ? 'اختر الشركة المصنعة' : 'Select Car Make'} 
              />
              <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'الموديل' : 'Model'}</h4>
              <CustomSelect 
                value={selectedModel} 
                onChange={(v) => { setSelectedModel(v); setSelectedYear(''); setSelectedEngine(''); }} 
                options={models} 
                placeholder={isRTL ? 'اختر الموديل' : 'Select Model'} 
                disabled={!selectedMake} 
              />
              <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'السنة' : 'Year'}</h4>
              <CustomSelect 
                value={selectedYear} 
                onChange={(v) => { setSelectedYear(v); setSelectedEngine(''); }} 
                options={years} 
                placeholder={isRTL ? 'اختر السنة' : 'Select Year'} 
                disabled={!selectedModel} 
              />
              <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'المحرك' : 'Engine'}</h4>
              <CustomSelect 
                value={selectedEngine} 
                onChange={setSelectedEngine} 
                options={engines} 
                placeholder={isRTL ? 'اختر المحرك' : 'Select Engine'} 
                disabled={!selectedYear} 
              />
            </div>
            <div className="mb-6 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'نوع القطعة' : 'Part Type'}</h4>
              <div className="space-y-4">
                {CATEGORIES.map(cat => {
                  const isSelected = selectedCats.includes(cat.id);
                  const isExpanded = expandedCats.includes(cat.id);
                  return (
                  <div key={cat.id} className="flex flex-col">
                    <div 
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => toggleCat(cat.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-100">
                          <img src={cat.image} alt={cat.id} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-black transition-colors ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
                            {isRTL ? cat.labelAR : cat.labelEN}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {cat.count} {isRTL ? 'منتج' : 'Products'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="relative flex items-center justify-center mr-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-primary checked:border-primary transition-all"
                          />
                          <svg className={`absolute w-3 h-3 text-white pointer-events-none transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 14 10" fill="none">
                            <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        {cat.subCategories && (
                          <button 
                            onClick={(e) => toggleExpandCat(cat.id, e)} 
                            className="p-1.5 text-gray-400 hover:text-primary bg-white hover:bg-primary/10 rounded-lg transition-colors border border-gray-100 shadow-sm"
                          >
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>
                    {cat.subCategories && isExpanded && (
                      <div className={`flex flex-col gap-2 mt-2 pt-2 pb-2 ${isRTL ? 'pr-12 border-r-2 border-gray-100' : 'pl-12 border-l-2 border-gray-100'}`}>
                        {cat.subCategories.map(sub => (
                          <label key={sub.id} className="flex items-center justify-between cursor-pointer group py-1">
                            <div className="flex items-center gap-2">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={selectedCats.includes(sub.id)}
                                  onChange={() => toggleCat(sub.id)}
                                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded cursor-pointer checked:bg-primary checked:border-primary transition-all"
                                />
                                <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <span className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors">{isRTL ? sub.labelAR : sub.labelEN}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{sub.count}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <button 
                onClick={() => { setSelectedBrands([]); setSelectedCats([]); setQuery(''); setSelectedMake(''); setSelectedModel(''); setSelectedYear(''); setSelectedEngine(''); }}
                className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm text-sm"
              >
                <SlidersHorizontal size={16} />
                {isRTL ? 'إعادة تعيين' : 'Reset'}
              </button>
              <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-md text-sm">
                {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
              </button>
            </div>
          </aside>

          <main className="flex-1 w-full min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button 
                onClick={() => setSelectedBrands([])}
                className={`flex items-center justify-center h-14 rounded-xl border-2 font-bold text-lg transition-all ${selectedBrands.length === 0 ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 text-gray-600 hover:border-primary/50 bg-white'}`}
              >
                {isRTL ? 'الكل' : 'All'}
              </button>
              {BRANDS.map(brand => (
                <button 
                  key={brand.name}
                  onClick={() => setSelectedBrands([brand.name])}
                  className={`flex items-center justify-center h-14 rounded-xl border-2 font-bold transition-all overflow-hidden ${selectedBrands.includes(brand.name) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-white'}`}
                >
                  <span className={`text-xl font-black ${brand.name === 'Borsehung' ? 'text-[#006B3F]' : brand.name === 'Vika' ? 'text-[#0033A0] italic' : 'text-[#E3000F] italic'}`}>
                    {brand.name === 'Vika' ? <><span className="-skew-x-12 inline-block">v</span>ika</> : brand.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-xl p-4 mb-6 gap-4 shadow-sm">
              <div className="text-sm font-bold text-gray-500">
                {isRTL ? `عرض ${filtered.length} منتج` : `Showing ${filtered.length} products`}
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="popular">{isRTL ? 'الأكثر طلباً' : 'Most Popular'}</option>
                  <option value="newest">{isRTL ? 'الأحدث' : 'Newest'}</option>
                </select>
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>
                    <List size={20} />
                  </button>
                  <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>
                    <LayoutGrid size={20} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-6 bg-white border border-gray-200 text-[#1C1C1C] font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <SlidersHorizontal size={18} />
              {isRTL ? 'الفلاتر' : 'Filters'}
            </button>

            <div className="bg-gradient-to-r from-[#1C1F2A] to-gray-800 rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <HelpCircle size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black mb-1">{isRTL ? 'لم تجد القطعة المطلوبة؟' : 'Can\'t find your part?'}</h3>
                  <p className="text-gray-300 text-sm font-bold">{isRTL ? 'ارفع صورة القطعة القديمة أو اسمها، وسنقوم بتوفيرها لك فوراً.' : 'Upload the old part photo or name, and we will get it for you immediately.'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSpecialRequestOpen(true)}
                className="bg-primary hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-sm relative z-10"
              >
                {isRTL ? 'طلب قطعة خاصة' : 'Request Special Part'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              ) : filtered.length === 0 ? (
                <div className="col-span-full py-16 text-center text-gray-500 font-bold bg-white rounded-2xl border border-gray-200">
                  <div className="text-4xl mb-3">🔍</div>
                  {isRTL ? 'لا توجد نتائج تطابق بحثك' : 'No results found'}
                </div>
              ) : filtered.map(product => {
                const brandInfo = BRANDS.find(b => b.name === product.brand);
                const bgColor = brandInfo?.color || '#1C1C1C';

                return (
                  <Link key={product.id} to={`/products/${product.id}`} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 group flex flex-col">
                    <div className="relative aspect-square p-6 flex items-center justify-center bg-white border-b border-gray-100">
                      <div 
                        className="absolute top-4 start-4 text-white font-bold text-[11px] px-3 py-1 rounded-md z-10"
                        style={{ backgroundColor: bgColor }}
                      >
                        {product.brand}
                      </div>
                      <button 
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-4 end-4 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm z-10 transition-colors"
                      >
                        <Heart size={16} className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                      <img
                        src={`https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&q=70&auto=format&seed=${product.id}`}
                        alt={isRTL ? product.name_ar : product.name_en}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1 text-center bg-white">
                      <h3 className="font-black text-[#1C1C1C] text-[16px] mb-1">{isRTL ? product.name_ar : product.name_en}</h3>
                      <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                        <span className="text-gray-400 text-[12px] font-bold">{product.partNumber}</span>
                      </div>
                      
                      {user?.role === 'DEALER' ? (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-primary">{isRTL ? 'سعر الجملة' : 'Wholesale Price'}</span>
                            {user.dealerProfile?.discountRate > 0 && (
                              <span className="text-[10px] font-black bg-primary text-white px-1.5 py-0.5 rounded" dir="ltr">
                                -{user.dealerProfile.discountRate}%
                              </span>
                            )}
                          </div>
                          <span className="text-xl font-black text-primary" dir="ltr">EGP {getDealerPrice(product.wholesalePrice).toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-black text-[#1C1C1C] mb-4 block">EGP {product.retailPrice.toLocaleString()}</span>
                      )}

                      <div className="mt-auto flex flex-col gap-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                            // Optional: Show a toast here
                          }}
                          className="w-full bg-primary text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors shadow-sm"
                        >
                          <ShoppingCart size={16} />
                          {isRTL ? 'أضف لقائمة الطلبات' : 'Add to Quote'}
                        </button>
                        <button className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors">
                          {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
                        </button>
                      </div>
                    </div>

                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 mb-8" dir="ltr">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-primary hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                        currentPage === page 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-primary hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
      
      <SpecialRequestModal isOpen={specialRequestOpen} onClose={() => setSpecialRequestOpen(false)} />
    </div>
  );
};

export default ProductsPage;
