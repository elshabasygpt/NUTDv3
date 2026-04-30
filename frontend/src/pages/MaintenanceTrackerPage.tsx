import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, Search, ChevronRight, Car, PenTool as Tool, AlertTriangle, CheckCircle2, ChevronLeft, ShieldCheck, Clock } from 'lucide-react';

const MOCK_DATA = {
  carInfo: 'تويوتا كامري 2024 - 2.5L',
  lastService: '12 مارس 2026',
  mileage: '45,000 كم',
  parts: [
    { id: 1, name: 'زيت المحرك', status: 'good', lastChanged: '40,000 كم', nextChange: '50,000 كم' },
    { id: 2, name: 'فحمات الفرامل الأمامية', status: 'warning', lastChanged: '20,000 كم', nextChange: '45,000 كم' },
    { id: 3, name: 'فلتر الهواء', status: 'danger', lastChanged: '10,000 كم', nextChange: '30,000 كم' },
    { id: 4, name: 'بوجيهات (شمعات الإشعال)', status: 'good', lastChanged: '40,000 كم', nextChange: '80,000 كم' },
  ],
  warranties: [
    { id: 101, partName: 'كومبريسور مكيف دنسو', status: 'active', validUntil: '12 مارس 2027', conditions: 'أو 60,000 كم أيهما أقرب' },
    { id: 102, partName: 'طرمبة بنزين أصلية', status: 'pending', validUntil: 'قيد المراجعة', conditions: 'في انتظار موافقة الإدارة' }
  ]
};

const MaintenanceTrackerPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [phone, setPhone] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warranties, setWarranties] = useState<any[]>(MOCK_DATA.warranties);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setLoading(true);
    setTimeout(() => {
      // Load warranties from localStorage for this phone number
      const storedData = JSON.parse(localStorage.getItem('nutd_warranties') || '[]');
      const userWarranties = storedData.filter((w: any) => w.phone === phone);
      
      // Combine user warranties with mock data (for demonstration)
      setWarranties([...userWarranties, ...MOCK_DATA.warranties]);
      
      setLoading(false);
      setIsLoaded(true);
    }, 1000); // Simulate API call
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle2 size={20} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'danger': return <AlertTriangle size={20} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Breadcrumbs */}
      <div className="bg-[#F8F9FA] py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-400">{isRTL ? 'ملف الصيانة' : 'Maintenance Tracker'}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tool size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-4">
            {isRTL ? 'ملف الصيانة الذكي' : 'Smart Maintenance Tracker'}
          </h1>
          <p className="text-gray-500 font-bold text-lg max-w-xl mx-auto">
            {isRTL 
              ? 'أدخل رقم جوالك لتتبع حالة قطع غيار سيارتك ومعرفة مواعيد الصيانة القادمة لتجنب الأعطال المفاجئة.' 
              : 'Enter your phone number to track your car\'s parts health and upcoming maintenance schedule.'}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto mb-10 relative overflow-hidden">
           <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
           
           <form onSubmit={handleSearch} className="relative z-10 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                  <Phone size={20} />
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isRTL ? 'رقم الجوال...' : 'Phone Number...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 ps-12 pe-4 text-lg font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !phone}
                className="bg-primary hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 shrink-0"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search size={20} />
                    {isRTL ? 'استعلام' : 'Check'}
                  </>
                )}
              </button>
           </form>
        </div>

        {/* Dashboard Results */}
        {isLoaded && (
          <div className="animate-in slide-in-from-bottom-8 duration-500 fade-in">
            
            {/* Vehicle Info Card */}
            <div className="bg-[#1C1F2A] rounded-2xl p-6 md:p-8 text-white mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
               <div className="absolute -start-10 -bottom-10 opacity-10">
                 <Car size={150} />
               </div>
               <div className="relative z-10">
                 <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                   <Car size={24} className="text-primary" />
                   {MOCK_DATA.carInfo}
                 </h2>
                 <div className="flex gap-6 text-gray-400 font-bold text-sm">
                   <p>{isRTL ? 'قراءة العداد الحالية:' : 'Current Mileage:'} <span className="text-white">{MOCK_DATA.mileage}</span></p>
                   <p>{isRTL ? 'آخر صيانة مسجلة:' : 'Last Service:'} <span className="text-white">{MOCK_DATA.lastService}</span></p>
                 </div>
               </div>
               <button className="relative z-10 bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap">
                 {isRTL ? 'تحديث العداد' : 'Update Mileage'}
               </button>
            </div>

            {/* Parts Status List */}
            <h3 className="text-xl font-black text-[#1C1C1C] mb-6 border-b border-gray-200 pb-4">
              {isRTL ? 'حالة القطع الدورية' : 'Wear & Tear Parts Status'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_DATA.parts.map(part => (
                <div key={part.id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col ${getStatusColor(part.status)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(part.status)}
                      <h4 className="font-bold text-gray-900 text-lg">{part.name}</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-5 text-sm font-bold text-gray-600">
                    <div className="bg-white/50 rounded-lg p-3 border border-black/5">
                      <span className="block text-xs text-gray-400 mb-1">{isRTL ? 'تم التغيير عند' : 'Changed at'}</span>
                      {part.lastChanged}
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 border border-black/5">
                      <span className="block text-xs text-gray-400 mb-1">{isRTL ? 'التغيير القادم' : 'Next Change'}</span>
                      {part.nextChange}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {part.status === 'danger' ? (
                      <Link to={`/products?q=${part.name}`} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                        {isRTL ? 'اشترِ القطعة الآن' : 'Buy Part Now'}
                        <ChevronLeft size={16} className={isRTL ? '' : 'rotate-180'} />
                      </Link>
                    ) : part.status === 'warning' ? (
                      <Link to={`/products?q=${part.name}`} className="w-full bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                        {isRTL ? 'تصفح الأسعار' : 'Browse Prices'}
                      </Link>
                    ) : (
                      <div className="w-full bg-green-50 text-green-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        {isRTL ? 'الحالة ممتازة' : 'Excellent Condition'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Warranties Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-xl font-black text-[#1C1C1C] flex items-center gap-2">
                  <ShieldCheck size={24} className="text-primary" />
                  {isRTL ? 'الضمانات المسجلة' : 'Registered Warranties'}
                </h3>
                <Link to="/warranty" className="text-sm font-bold text-primary hover:underline">
                  {isRTL ? '+ تفعيل ضمان جديد' : '+ Activate New Warranty'}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warranties.map(warranty => (
                  <div key={warranty.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    {warranty.status === 'active' ? (
                      <div className="absolute top-0 end-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        {isRTL ? 'نشط' : 'Active'}
                      </div>
                    ) : (
                      <div className="absolute top-0 end-0 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        {isRTL ? 'قيد المراجعة' : 'Pending'}
                      </div>
                    )}
                    
                    <h4 className="font-bold text-gray-900 text-lg mb-3">{warranty.partName}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                        <Clock size={16} className={warranty.status === 'active' ? 'text-green-500' : 'text-yellow-500'} />
                        <span className="text-gray-400">{isRTL ? 'صالح حتى:' : 'Valid Until:'}</span>
                        <span className={warranty.status === 'active' ? 'text-green-600' : 'text-yellow-600'}>
                          {warranty.validUntil}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold bg-gray-50 p-2 rounded-lg">
                        <AlertTriangle size={14} />
                        {warranty.conditions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MaintenanceTrackerPage;
