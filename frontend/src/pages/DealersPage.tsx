import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  MapPin, Phone, Star, Award, Zap, Wrench, Search, Navigation, 
  Building2, ChevronRight, Briefcase, ArrowRight, CheckCircle2
} from 'lucide-react';

// Mock Data
const LOCATIONS = {
  'القاهرة': ['مدينة نصر', 'التجمع الخامس', 'المعادي', 'مصر الجديدة', 'شبرا'],
  'الإسكندرية': ['سموحة', 'سيدي جابر', 'المنتزه', 'محطة الرمل', 'ميامي'],
  'الجيزة': ['الدقي', 'المهندسين', 'الهرم', 'فيصل', 'الشيخ زايد'],
  'القليوبية': ['بنها', 'شبرا الخيمة', 'طوخ', 'العبور'],
};

const BRANDS = ['Borsehung', 'Vika', 'KDD', 'Bosch', 'NGK'];
const TYPES = ['معتمد ذهبي', 'جملة', 'تجزئة'];

const MOCK_DEALERS = [
  { id: '1', name: 'كيمو ستور - المركز الرئيسي', rating: 4.9, reviews: 128, type: 'معتمد ذهبي', badges: ['premium', 'fast'], gov: 'القاهرة', city: 'مدينة نصر', address: 'شارع مكرم عبيد، المنطقة السادسة', phone: '01012345678', brands: ['Borsehung', 'Vika', 'Bosch'] },
  { id: '2', name: 'الشركة الهندسية لقطع الغيار', rating: 4.7, reviews: 85, type: 'جملة', badges: ['installation'], gov: 'الإسكندرية', city: 'سموحة', address: 'دوران سموحة بجوار نادي سموحة', phone: '01212345678', brands: ['KDD', 'NGK'] },
  { id: '3', name: 'أوتو ماركت الرضوان', rating: 4.8, reviews: 210, type: 'معتمد ذهبي', badges: ['premium'], gov: 'القاهرة', city: 'التجمع الخامس', address: 'محور التسعين الشمالي، القطاع الثاني', phone: '01112345678', brands: ['Borsehung', 'Vika', 'KDD', 'Bosch', 'NGK'] },
  { id: '4', name: 'المركز العالمي للسيارات', rating: 4.6, reviews: 94, type: 'تجزئة', badges: ['fast', 'installation'], gov: 'الجيزة', city: 'الشيخ زايد', address: 'المحور المركزي بجوار مول العرب', phone: '01512345678', brands: ['Bosch', 'NGK'] },
  { id: '5', name: 'مؤسسة التوفيق للتجارة', rating: 4.5, reviews: 62, type: 'جملة', badges: [], gov: 'الجيزة', city: 'الدقي', address: 'شارع التحرير، ميدان الدقي', phone: '01098765432', brands: ['Vika', 'KDD'] },
  { id: '6', name: 'ابناء الشيمي لقطع الغيار', rating: 4.4, reviews: 45, type: 'تجزئة', badges: ['fast'], gov: 'القليوبية', city: 'بنها', address: 'شارع فريد ندا، الفيلات', phone: '01298765432', brands: ['Borsehung'] },
];

const renderBadge = (badge: string) => {
  switch (badge) {
    case 'premium':
      return <div key={badge} className="flex items-center gap-1 bg-[#FFB300]/10 text-[#FFB300] px-2 py-0.5 rounded text-[11px] font-bold border border-[#FFB300]/20"><Award size={12} /> معتمد ذهبي</div>;
    case 'fast':
      return <div key={badge} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-100"><Zap size={12} /> استجابة سريعة</div>;
    case 'installation':
      return <div key={badge} className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded text-[11px] font-bold border border-green-100"><Wrench size={12} /> يتوفر تركيب</div>;
    default:
      return null;
  }
};

const DealersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [search, setSearch] = useState('');
  const [gov, setGov] = useState('');
  const [city, setCity] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [hoveredDealer, setHoveredDealer] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLocateNearest = () => {
    setIsLocating(true);
    setTimeout(() => {
      setGov('');
      setCity('');
      setSelectedDealer('3');
      setIsLocating(false);
    }, 1500);
  };

  const filteredDealers = useMemo(() => {
    return MOCK_DEALERS.filter(dealer => {
      if (gov && dealer.gov !== gov) return false;
      if (city && dealer.city !== city) return false;
      if (selectedBrand && !dealer.brands.includes(selectedBrand)) return false;
      if (selectedType && dealer.type !== selectedType) return false;
      if (search && !dealer.name.includes(search) && !dealer.address.includes(search)) return false;
      return true;
    });
  }, [gov, city, selectedBrand, selectedType, search]);

  const mapQuery = useMemo(() => {
    const targetDealerId = hoveredDealer || selectedDealer;
    if (targetDealerId) {
      const dealer = MOCK_DEALERS.find(d => d.id === targetDealerId);
      if (dealer) return `${dealer.name}, ${dealer.address}, ${dealer.city}, ${dealer.gov}, Egypt`;
    }
    if (city && gov) return `${city}, ${gov}, Egypt`;
    if (gov) return `${gov}, Egypt`;
    return 'Cairo, Egypt';
  }, [selectedDealer, hoveredDealer, city, gov]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* 1. Hero & Invite Banner */}
      <section className="bg-[#1C1F2A] text-white pt-20 pb-16 relative overflow-hidden">
        {/* Abstract Background Patterns */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full blur-[100px]"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-sm font-bold text-primary-300 mb-6">
                <Star size={16} className="fill-current" />
                {isRTL ? 'شبكة الموزعين الأقوى في مصر' : 'The Strongest Dealer Network in Egypt'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                {isRTL ? 'اعثر على موزعي ' : 'Find '}
                <span className="text-primary">NUTD</span>
                <br />
                {isRTL ? 'المعتمدين بالقرب منك' : 'Authorized Dealers Near You'}
              </h1>
              <p className="text-gray-300 text-lg max-w-xl font-medium mb-10 leading-relaxed">
                {isRTL 
                  ? 'نتعاون مع نخبة من أفضل تجار قطع الغيار لضمان توفير قطع أصلية 100% وأسعار تنافسية وخدمة ما بعد البيع تليق بك.' 
                  : 'We collaborate with an elite group of spare parts dealers to ensure 100% original parts, competitive prices, and premium after-sales service.'}
              </p>
              
              <button 
                onClick={() => document.getElementById('locator')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-white hover:bg-primary-600 font-bold py-4 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <Search size={20} />
                {isRTL ? 'ابحث عن موزع الآن' : 'Search for a Dealer Now'}
              </button>
            </div>
            
            {/* Invite Banner Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/20 text-[#1C1C1C] relative">
              <div className="absolute top-0 right-8 w-20 h-1 bg-primary rounded-b-full"></div>
              <Briefcase size={40} className="text-primary mb-6" />
              <h3 className="text-2xl font-black mb-4">
                {isRTL ? 'هل أنت تاجر قطع غيار؟' : 'Are you a spare parts dealer?'}
              </h3>
              <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                {isRTL 
                  ? 'انضم إلى شبكة NUTD واستفد من الوصول لآلاف العملاء يومياً، ونظام إدارة مبيعات متطور، وأسعار جملة حصرية من كبرى التوكيلات العالمية.' 
                  : 'Join the NUTD network and benefit from reaching thousands of customers daily, an advanced sales management system, and exclusive wholesale prices.'}
              </p>
              <ul className="space-y-3 mb-8 text-sm font-bold text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> {isRTL ? 'تسجيل مجاني وبدون رسوم مخفية' : 'Free registration, no hidden fees'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> {isRTL ? 'لوحة تحكم خاصة لإدارة مبيعاتك' : 'Dedicated dashboard for sales'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> {isRTL ? 'دعم فني وتسويقي متواصل' : 'Continuous technical & marketing support'}</li>
              </ul>
              <Link to="/register" className="group w-full bg-[#1C1F2A] hover:bg-black text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-transparent hover:border-gray-700">
                {isRTL ? 'قدم طلب انضمام الآن' : 'Apply to Join Now'}
                <ArrowRight size={18} className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Premium Spotlight (Small Carousel / Grid) */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <Award className="text-[#FFB300]" size={32} />
            <h2 className="text-2xl md:text-3xl font-black text-[#1C1C1C]">
              {isRTL ? 'موزعينا الذهبيين' : 'Premium Dealers Spotlight'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_DEALERS.filter(d => d.type === 'معتمد ذهبي').slice(0,3).map(dealer => (
              <div key={`premium-${dealer.id}`} className="bg-gradient-to-br from-[#FFB300]/5 to-transparent border border-[#FFB300]/20 rounded-3xl p-6 relative group hover:shadow-xl hover:border-[#FFB300]/50 transition-all cursor-pointer">
                <div className="absolute top-6 end-6 bg-[#FFB300] text-white text-xs font-black px-3 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-[#FFB300]/20">
                  <Star size={12} className="fill-current" /> {dealer.rating}
                </div>
                <div className="w-16 h-16 bg-white rounded-2xl border border-[#FFB300]/30 flex items-center justify-center mb-6 shadow-sm">
                  <Building2 size={28} className="text-[#FFB300]" />
                </div>
                <h3 className="text-xl font-black text-[#1C1C1C] mb-2">{dealer.name}</h3>
                <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mb-6">
                  <MapPin size={16} className="text-gray-400" /> {dealer.city}، {dealer.gov}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {dealer.brands.map(b => (
                    <span key={b} className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">{b}</span>
                  ))}
                </div>
                <Link to={`/products?dealer=${dealer.id}`} className="block text-center w-full bg-white border-2 border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-white font-bold py-2.5 rounded-xl transition-colors">
                  {isRTL ? 'تصفح منتجات التاجر' : 'Browse Dealer Products'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Split-Screen Locator */}
      <section id="locator" className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Filters Bar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col lg:flex-row items-center gap-4">
          
          <div className="relative flex-1 w-full">
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
            <input 
              type="text" 
              placeholder={isRTL ? 'ابحث باسم التاجر أو العنوان...' : 'Search by dealer name or address...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-12 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
            <select value={gov} onChange={(e) => {setGov(e.target.value); setCity('');}} className="bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary shrink-0">
              <option value="">{isRTL ? 'كل المحافظات' : 'All Govs'}</option>
              {Object.keys(LOCATIONS).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!gov} className="bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary disabled:opacity-50 shrink-0">
              <option value="">{isRTL ? 'كل المدن' : 'All Cities'}</option>
              {gov && LOCATIONS[gov as keyof typeof LOCATIONS].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary shrink-0">
              <option value="">{isRTL ? 'كل التوكيلات' : 'All Brands'}</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary shrink-0">
              <option value="">{isRTL ? 'نوع التاجر' : 'Dealer Type'}</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button 
              onClick={handleLocateNearest}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-3 rounded-xl border border-blue-200 transition-colors shrink-0"
              title={isRTL ? 'تحديد موقعي' : 'Locate Me'}
            >
              {isLocating ? <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/> : <Navigation size={20} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* List Section (Scrollable) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-500 text-sm">
                {isRTL ? `عرض ${filteredDealers.length} موزع` : `Showing ${filteredDealers.length} dealers`}
              </span>
            </div>

            {filteredDealers.length > 0 ? (
              filteredDealers.map(dealer => (
                <div 
                  key={dealer.id}
                  onClick={() => setSelectedDealer(dealer.id)}
                  onMouseEnter={() => setHoveredDealer(dealer.id)}
                  onMouseLeave={() => setHoveredDealer(null)}
                  className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-sm
                    ${selectedDealer === dealer.id ? 'border-primary ring-1 ring-primary/30 shadow-md scale-[1.02]' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">{dealer.type}</span>
                        {dealer.badges.map(renderBadge)}
                      </div>
                      <h3 className={`text-lg font-black ${selectedDealer === dealer.id ? 'text-primary' : 'text-[#1C1C1C]'}`}>
                        {dealer.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg shrink-0">
                      <Star size={12} className="text-[#FFB300] fill-current" />
                      <span className="text-xs font-bold text-gray-700">{dealer.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5">
                    <p className="text-gray-500 text-sm font-medium flex items-start gap-2">
                      <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      {dealer.address}، {dealer.city}، {dealer.gov}
                    </p>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                      <Phone size={16} className="text-gray-400 shrink-0" />
                      <span dir="ltr" className="font-bold text-gray-700">{dealer.phone}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <a 
                      href={`https://wa.me/2${dealer.phone}`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      {isRTL ? 'واتساب' : 'WhatsApp'}
                    </a>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(dealer.name + ' ' + dealer.address + ' ' + dealer.city)}`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapPin size={16} />
                      {isRTL ? 'الاتجاهات' : 'Directions'}
                    </a>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {dealer.brands.slice(0,3).map(b => (
                        <span key={b} className="bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">{b}</span>
                      ))}
                      {dealer.brands.length > 3 && (
                        <span className="bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md">+{dealer.brands.length - 3}</span>
                      )}
                    </div>
                    
                    <Link 
                      to={`/products?dealer=${dealer.id}`}
                      className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-[#1C1F2A] hover:text-white transition-colors"
                      title={isRTL ? 'تصفح منتجات التاجر' : 'Browse Dealer Products'}
                    >
                      <ChevronRight size={20} className={isRTL ? 'rotate-180' : ''} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center">
                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{isRTL ? 'لا يوجد نتائج' : 'No Results'}</h3>
                <p className="text-gray-500 font-medium">{isRTL ? 'حاول تغيير معايير البحث أو اختيار محافظة أخرى.' : 'Try changing your search criteria or selecting another governorate.'}</p>
              </div>
            )}
          </div>

          {/* Map Section (Sticky) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 h-[500px] lg:h-[calc(100vh-140px)] rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50 relative group">
            <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10"></div>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0 relative z-10 transition-opacity duration-500"
              title="Dealer Dynamic Map"
              loading="lazy"
            />
            {/* Embedded look inner border */}
            <div className="absolute inset-0 border-[6px] border-white/30 rounded-3xl pointer-events-none z-20 mix-blend-overlay"></div>
            
            {/* Map Overlay Badge */}
            <div className="absolute top-6 start-6 z-30 bg-white/90 backdrop-blur shadow-lg border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-sm text-gray-700">{isRTL ? 'خريطة تفاعلية حية' : 'Live Interactive Map'}</span>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
};

export default DealersPage;
