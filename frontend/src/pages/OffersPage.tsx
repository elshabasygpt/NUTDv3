import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, TrendingUp, Search, SlidersHorizontal, ArrowDownToLine } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import SEO from '../components/seo/SEO';

import api from '../services/api';
const BRANDS = ['Borsehung', 'Vika', 'KDD'];
const CATEGORIES = [
  { id: 'Brakes', labelAR: 'نظام الفرامل', labelEN: 'Brakes' },
  { id: 'Suspension', labelAR: 'نظام التعليق', labelEN: 'Suspension' },
  { id: 'Engine', labelAR: 'المحرك', labelEN: 'Engine' },
  { id: 'Electrical', labelAR: 'كهرباء وإضاءة', labelEN: 'Electrical' },
];

const OffersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { addToCart } = useCart();

  const [query, setQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOffers = async () => {
      try {
        const res = await api.get('/offers');
        setOffers(res.data.data.filter((o: any) => o.isActive));
      } catch (error) {
        console.error('Failed to fetch offers', error);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [query, selectedBrands, selectedCats]);

  const toggleBrand = (b: string) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleCat = (c: string) => setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const filteredOffers = useMemo(() => {
    let items = offers;
    if (query) {
      items = items.filter(p => 
        p.name.includes(query) || 
        p.oeNumber.toLowerCase().includes(query.toLowerCase()) || 
        p.partNumber.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (selectedBrands.length) items = items.filter(p => selectedBrands.includes(p.brand));
    if (selectedCats.length) items = items.filter(p => selectedCats.includes(p.category));
    return items;
  }, [query, selectedBrands, selectedCats, offers]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <SEO title={isRTL ? 'عروض الجملة' : 'Wholesale Offers'} />
      {/* Page Header */}
      <div className="bg-[#1C1F2A] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold mb-4 bg-primary/10 w-fit px-3 py-1.5 rounded-full">
            <TrendingUp size={18} />
            <span>{isRTL ? 'توفير حقيقي، أرباح مضمونة' : 'Real Savings, Guaranteed Profits'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {isRTL ? 'عروض وباقات التجار' : 'Dealer Wholesale Offers'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            {isRTL 
              ? 'تصفح أحدث الباقات الاستثمارية وعروض تصفية المخزون المصممة خصيصاً لتجار الجملة ومراكز الصيانة المعتمدة.'
              : 'Browse the latest investment packages and clearance offers designed specifically for wholesalers and certified service centers.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-[#1C1C1C] font-black text-lg">
                <SlidersHorizontal size={20} />
                <h3>{isRTL ? 'تصفية العروض' : 'Filter Offers'}</h3>
              </div>

              {/* Search */}
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder={isRTL ? 'ابحث برقم القطعة OE/Part...' : 'Search OE/Part Number...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                />
                <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              </div>

              {/* Brands Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'العلامة التجارية' : 'Brand'}</h4>
                <div className="space-y-3">
                  {BRANDS.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded cursor-pointer checked:bg-primary checked:border-primary transition-all"
                        />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <h4 className="font-bold text-[#1C1C1C] text-sm mb-3">{isRTL ? 'نوع النظام' : 'System Type'}</h4>
                <div className="space-y-3">
                  {CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(cat.id)}
                          onChange={() => toggleCat(cat.id)}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded cursor-pointer checked:bg-primary checked:border-primary transition-all"
                        />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">{isRTL ? cat.labelAR : cat.labelEN}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header info */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6 flex justify-between items-center shadow-sm">
              <span className="font-bold text-gray-600">
                {isRTL ? `عرض ${filteredOffers.length} عرض جملة متاح` : `Showing ${filteredOffers.length} wholesale offers`}
              </span>
              <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-600 transition-colors">
                <ArrowDownToLine size={16} />
                {isRTL ? 'تحميل كشف العروض (PDF)' : 'Download Offers (PDF)'}
              </button>
            </div>

            {/* Offers Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(n => (
                  <div key={n} className="bg-white rounded-2xl h-64 border border-gray-200 animate-pulse"></div>
                ))}
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{isRTL ? 'لا توجد عروض تطابق بحثك' : 'No offers match your search'}</h3>
                <button onClick={() => { setQuery(''); setSelectedBrands([]); setSelectedCats([]); }} className="text-primary font-bold hover:underline">
                  {isRTL ? 'إزالة الفلاتر' : 'Clear Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredOffers.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row overflow-hidden group">
                    
                    {/* Image & Stock */}
                    <div className="w-full sm:w-48 bg-gray-50 p-4 border-b sm:border-b-0 sm:border-r border-gray-100 flex flex-col justify-between items-center relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary group-hover:h-2 transition-all"></div>
                      <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" />
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
                        <div className="bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg text-center shrink-0">
                          <span className="block text-[10px] font-bold text-orange-600">{isRTL ? 'توفير' : 'Save'}</span>
                          <span className="block font-black text-orange-600" dir="ltr">{product.savings.toLocaleString()} ج.م</span>
                        </div>
                      </div>

                      {/* OE & Part Numbers */}
                      <div className="flex gap-4 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                          <span className="block text-[10px] font-bold text-gray-500 mb-0.5">OE Number</span>
                          <span className="block font-bold text-sm text-gray-800 font-mono tracking-wider">{product.oeNumber}</span>
                        </div>
                        <div className="w-px bg-gray-200"></div>
                        <div>
                          <span className="block text-[10px] font-bold text-gray-500 mb-0.5">Part Number</span>
                          <span className="block font-bold text-sm text-gray-800 font-mono tracking-wider">{product.partNumber}</span>
                        </div>
                      </div>

                      {/* Package Details */}
                      <div className="mb-6 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Package size={16} className="text-gray-400" />
                          <span className="font-bold text-sm text-primary">{product.packageType}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                          {isRTL ? 'الحد الأدنى للطلب:' : 'MOQ:'} <span className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{product.moq}</span>
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 line-through" dir="ltr">{product.oldPrice.toLocaleString()} ج.م</span>
                          <span className="text-xl font-black text-[#1C1C1C]" dir="ltr">{product.newPrice.toLocaleString()} ج.م</span>
                        </div>
                        <button className="bg-[#1C1C1C] text-white hover:bg-primary font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm" onClick={() => addToCart({ id: product.id, partNumber: product.partNumber, name_ar: product.name, name_en: product.name, brand: product.brand, category: product.category, retailPrice: product.newPrice, wholesalePrice: product.newPrice, stock: 10, isActive: true, image: product.image }, product.moq, product.newPrice)}>
                          {isRTL ? 'إضافة للطلبية' : 'Add Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
