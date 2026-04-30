import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Building2, Award } from 'lucide-react';
import api from '../services/api';
import SEO from '../components/seo/SEO';

const AgenciesPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [agencies, setAgencies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await api.get('/agencies');
        setAgencies(res.data.data.filter((a: any) => a.isActive));
      } catch (error) {
        console.error('Failed to fetch agencies', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <SEO title={isRTL ? 'التوكيلات الحصرية' : 'Exclusive Agencies'} />
      {/* Breadcrumbs */}
      <div className="bg-[#F8F9FA] py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-400">{isRTL ? 'التوكيلات الحصرية' : 'Exclusive Agencies'}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#1C1F2A] py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/20 mb-6">
            <Award size={16} className="text-[#FFB300]" />
            {isRTL ? 'الوكيل الحصري المعتمد' : 'Official Exclusive Agent'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            {isRTL ? 'شركاء النجاح والجودة' : 'Partners of Success & Quality'}
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? 'نفخر في نماء المتحدة بكوننا الوكيل المعتمد لنخبة من كبرى العلامات التجارية العالمية في قطاع غيار السيارات، لضمان أعلى معايير الجودة لعملائنا.'
              : 'At Namā United, we are proud to be the authorized agent for elite global automotive spare parts brands, ensuring the highest quality standards for our clients.'}
          </p>
        </div>
      </section>

      {/* Agencies List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-16">
            {isLoading ? (
              <div className="text-center py-20 text-gray-500 font-bold">Loading Agencies...</div>
            ) : agencies.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-bold">{isRTL ? 'لا توجد توكيلات حالياً' : 'No agencies currently available'}</div>
            ) : agencies.map((agency, index) => (
              <div 
                key={agency.id} 
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative shadow-lg group bg-gray-50 flex items-center justify-center p-8">
                    {agency.logo ? (
                      <img 
                        src={agency.logo} 
                        alt={agency.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="text-6xl font-black text-gray-300">{agency.name}</div>
                    )}
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <h2 className="text-3xl font-black text-[#1C1C1C] mb-2">
                    {agency.name}
                  </h2>
                  <h3 className="text-xl font-bold text-primary mb-6">
                    {agency.specialty}
                  </h3>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium">
                    {agency.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    <div className="bg-gray-50 border border-black/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
                      <Building2 size={24} className="text-gray-400" />
                      <span className="font-bold text-sm text-gray-800">
                        {isRTL ? 'المنشأ:' : 'Origin:'} {agency.origin}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link 
                      to={`/products?brand=${agency.name}`}
                      className="bg-primary text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                    >
                      {isRTL ? `تصفح منتجات ${agency.name}` : `Browse ${agency.name} Products`}
                      {isRTL ? <ArrowLeft size={20} /> : <ChevronRight size={20} />}
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            {isRTL ? 'هل تبحث عن أسعار الجملة لهذه التوكيلات؟' : 'Looking for wholesale prices for these brands?'}
          </h2>
          <p className="text-white/80 font-bold text-lg mb-8">
            {isRTL 
              ? 'انضم لشبكة موزعي نماء المتحدة واستفد من هوامش ربح حصرية ودعم متواصل.' 
              : 'Join Namā United\'s dealer network and benefit from exclusive margins and continuous support.'}
          </p>
          <Link 
            to="/dealers" 
            className="bg-white text-primary font-black py-4 px-10 rounded-xl inline-block hover:bg-gray-50 transition-colors shadow-lg"
          >
            {isRTL ? 'انضم كموزع الآن' : 'Join as a Dealer Now'}
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AgenciesPage;
