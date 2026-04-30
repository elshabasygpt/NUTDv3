import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, ChevronLeft, ChevronDown, MapPin, Award, Zap, Wrench, Map, Navigation, AlertCircle } from 'lucide-react';

// Mock Data for Governorates and Cities
const LOCATIONS = {
  'القاهرة': ['مدينة نصر', 'التجمع الخامس', 'المعادي', 'مصر الجديدة', 'شبرا'],
  'الإسكندرية': ['سموحة', 'سيدي جابر', 'المنتزه', 'محطة الرمل', 'ميامي'],
  'الجيزة': ['الدقي', 'المهندسين', 'الهرم', 'فيصل', 'الشيخ زايد'],
  'القليوبية': ['بنها', 'شبرا الخيمة', 'طوخ', 'العبور'],
};

const MOCK_DEALERS = [
  { id: '1', name: '010 1234 5678 (كيمو ستور)', distance: '2.4 كم', numericDist: 2.4, hasPhoneIcon: true, badges: ['premium', 'fast'], gov: 'القاهرة', city: 'مدينة نصر' },
  { id: '2', name: 'الشركة الهندسية لقطع الغيار', distance: '4.7 كم', numericDist: 4.7, hasPhoneIcon: false, badges: ['installation'], gov: 'الإسكندرية', city: 'سموحة' },
  { id: '3', name: 'مؤسسة التوفيق للتجارة', distance: '6.1 كم', numericDist: 6.1, hasPhoneIcon: false, badges: [], gov: 'الجيزة', city: 'الدقي' },
  { id: '4', name: 'أوتو ماركت الرضوان', distance: '1.2 كم', numericDist: 1.2, hasPhoneIcon: true, badges: ['premium'], gov: 'القاهرة', city: 'التجمع الخامس' },
  { id: '5', name: 'المركز العالمي للسيارات', distance: '3.5 كم', numericDist: 3.5, hasPhoneIcon: false, badges: ['fast', 'installation'], gov: 'الجيزة', city: 'الشيخ زايد' },
  { id: '6', name: 'ابناء الشيمي لقطع الغيار', distance: '8.0 كم', numericDist: 8.0, hasPhoneIcon: true, badges: [], gov: 'القليوبية', city: 'بنها' },
];

const renderBadge = (badge: string) => {
  switch (badge) {
    case 'premium':
      return <div key={badge} className="flex items-center gap-1 bg-[#FFB300]/10 text-[#FFB300] px-2 py-0.5 rounded text-[10px] font-bold border border-[#FFB300]/20"><Award size={12} /> معتمد ذهبي</div>;
    case 'fast':
      return <div key={badge} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100"><Zap size={12} /> استجابة سريعة</div>;
    case 'installation':
      return <div key={badge} className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold border border-green-100"><Wrench size={12} /> يتوفر تركيب</div>;
    default:
      return null;
  }
};

const DealerLocator = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [gov, setGov] = useState('');
  const [city, setCity] = useState('');
  const [selectedDealer, setSelectedDealer] = useState<string | null>('1');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [sortByNearest, setSortByNearest] = useState(false);
  
  // Map focusing logic
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [mapFocus, setMapFocus] = useState<'dealer' | 'user' | 'region'>('dealer');

  const handleLocateNearest = () => {
    setLocationError('');
    setIsLocating(true);

    if (!navigator.geolocation) {
      setLocationError(isRTL ? 'المتصفح الخاص بك لا يدعم تحديد الموقع' : 'Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    // Simulate finding location and calculating distances
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          setGov('');
          setCity('');
          setSortByNearest(true);
          setSelectedDealer('4'); // The closest one in mock data (1.2 km)
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setMapFocus('user');
          setIsLocating(false);
        }, 1000);
      },
      () => {
        setLocationError(isRTL ? 'يرجى السماح بصلاحية الموقع' : 'Please allow location permission');
        setIsLocating(false);
      }
    );
  };

  // Filter & Sort Dealers
  const filteredDealers = useMemo(() => {
    let result = MOCK_DEALERS.filter(dealer => {
      if (gov && dealer.gov !== gov) return false;
      if (city && dealer.city !== city) return false;
      return true;
    });

    if (sortByNearest) {
      result = [...result].sort((a, b) => a.numericDist - b.numericDist);
    }

    return result;
  }, [gov, city, sortByNearest]);

  // Map Query based on selection
  const mapQuery = useMemo(() => {
    if (mapFocus === 'user' && userCoords) {
      return `${userCoords.lat},${userCoords.lng}`;
    }
    
    if (mapFocus === 'dealer' && selectedDealer) {
      const dealer = MOCK_DEALERS.find(d => d.id === selectedDealer);
      // We encode a search for the region since mock dealer names don't exist on Google Maps
      if (dealer) return `${dealer.city}, ${dealer.gov}, Egypt`; 
    }
    
    if (city && gov) return `${city}, ${gov}, Egypt`;
    if (gov) return `${gov}, Egypt`;
    return 'Cairo, Egypt';
  }, [selectedDealer, city, gov, mapFocus, userCoords]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRTL ? "rtl" : "ltr"}>
          
          {/* Right Side: Dealer List (Visually right in RTL) */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
            
            <div className="relative flex-1">
              <select 
                value={gov} 
                onChange={(e) => { 
                  setGov(e.target.value); 
                  setCity(''); 
                  setMapFocus('region');
                  setSelectedDealer(null);
                }}
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm appearance-none cursor-pointer"
              >
                <option value="">{isRTL ? 'جميع المحافظات' : 'All Governorates'}</option>
                {Object.keys(LOCATIONS).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown size={20} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-1">
              <select 
                value={city} 
                onChange={(e) => {
                  setCity(e.target.value);
                  setMapFocus('region');
                  setSelectedDealer(null);
                }}
                disabled={!gov}
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="">{isRTL ? 'جميع المدن/المناطق' : 'All Cities'}</option>
                {gov && LOCATIONS[gov as keyof typeof LOCATIONS].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={20} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

          </div>

            <button 
              onClick={handleLocateNearest}
              disabled={isLocating}
              className="w-full mb-6 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              {isLocating ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Navigation size={18} />
                  {isRTL ? 'استخدام موقعي الحالي للعثور على أقرب تاجر' : 'Use my current location to find nearest dealer'}
                </>
              )}
            </button>

            {locationError && (
              <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                {locationError}
              </div>
            )}

            {/* List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pe-2 custom-scrollbar">
            {filteredDealers.length > 0 ? (
              filteredDealers.map((dealer) => (
                <div 
                  key={dealer.id} 
                  onClick={() => {
                    setSelectedDealer(dealer.id);
                    setMapFocus('dealer');
                  }}
                  className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${
                    selectedDealer === dealer.id 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/50' 
                      : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  
                  {/* Info (Right side) */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedDealer === dealer.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <MapPin size={14} />
                      </div>
                      <span className={`font-bold text-[15px] ${selectedDealer === dealer.id ? 'text-primary' : 'text-[#1C1C1C]'}`}>
                        {dealer.name}
                      </span>
                    </div>
                    
                    {dealer.badges && dealer.badges.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2 mr-10 rtl:mr-10 ltr:ml-10">
                        {dealer.badges.map(renderBadge)}
                      </div>
                    )}

                    <div className="text-gray-500 text-sm font-medium flex items-center gap-2">
                      <div className="w-8 h-px bg-transparent"></div> {/* spacer */}
                      <MapPin size={12} className="text-gray-400" /> {dealer.gov} - {dealer.city}
                      <span className="mx-1">•</span>
                      {dealer.distance}
                      {dealer.hasPhoneIcon && <Phone size={12} className="text-gray-400 mx-1" />}
                    </div>
                  </div>

                  {/* Actions (Left side) */}
                  <div className="flex items-center gap-2 shrink-0 md:ml-auto" dir="ltr">
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(dealer.name + ' ' + dealer.city + ' ' + dealer.gov)}`}
                      target="_blank" rel="noreferrer"
                      className="bg-white border border-gray-200 text-gray-700 font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isRTL ? 'اتجاهات' : 'Directions'}
                    </a>
                    <a 
                      href="https://wa.me/201012345678" // Using generic mock phone
                      target="_blank" rel="noreferrer"
                      className="bg-[#25D366]/10 text-[#25D366] font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-[#25D366] hover:text-white transition-colors shadow-sm flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      {isRTL ? 'واتساب' : 'WhatsApp'}
                    </a>
                  </div>

                </div>
              ))
              ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <Map size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{isRTL ? 'لا يوجد موزعين' : 'No Dealers Found'}</h3>
                <p className="text-gray-500 font-medium">
                  {isRTL ? 'لم نتمكن من العثور على موزعين في هذه المنطقة حالياً.' : 'We could not find any dealers in this area right now.'}
                </p>
              </div>
            )}
            </div>

            {/* Show All Link */}
            <div className="mt-4 flex justify-start">
              <a href="/dealers" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                {isRTL ? 'عرض كل التجار' : 'Show all dealers'}
                <ChevronLeft size={16} />
              </a>
            </div>

          </div>

          {/* Left Side: Map (Visually left in RTL) */}
          <div className="lg:col-span-7 h-[450px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative group">
            {/* Professional Google Maps Iframe */}
            <div className="absolute inset-0 bg-gray-100 animate-pulse -z-10"></div>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0 relative z-10 transition-opacity duration-500"
              title="Dealer Map"
              loading="lazy"
            />
            {/* Subtle Overlay to make it look embedded */}
            <div className="absolute inset-0 border-[4px] border-white/20 rounded-3xl pointer-events-none z-20"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DealerLocator;
