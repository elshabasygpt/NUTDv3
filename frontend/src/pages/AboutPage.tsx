import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Users, Zap, Award, Phone } from 'lucide-react';

const AboutPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const coreValues = [
    {
      icon: ShieldCheck,
      titleAR: 'الثقة والمصداقية',
      titleEN: 'Trust & Credibility',
      descAR: 'نلتزم بأعلى معايير الشفافية في جميع تعاملاتنا مع شركائنا وعملائنا.',
      descEN: 'We adhere to the highest standards of transparency in all our dealings.'
    },
    {
      icon: Award,
      titleAR: 'جودة لا تنازل عنها',
      titleEN: 'Uncompromising Quality',
      descAR: 'لا نتعامل إلا مع قطع الغيار الأصلية والمعتمدة عالمياً لضمان سلامة وأداء المركبات.',
      descEN: 'We only deal with genuine and globally certified spare parts to ensure vehicle safety.'
    },
    {
      icon: Users,
      titleAR: 'شراكة مستدامة',
      titleEN: 'Sustainable Partnership',
      descAR: 'نعتبر تجار التجزئة ومراكز الصيانة شركاء نجاح، وندعم نموهم بكل السبل.',
      descEN: 'We consider retailers and service centers as partners of success, supporting their growth.'
    },
    {
      icon: Zap,
      titleAR: 'الابتكار والسرعة',
      titleEN: 'Innovation & Speed',
      descAR: 'نتبنى أحدث الحلول الرقمية، كالضمان الإلكتروني، لتسريع وتسهيل عمليات التوريد.',
      descEN: 'We adopt the latest digital solutions, like e-warranty, to speed up supply operations.'
    }
  ];

  const teamMembers = [
    {
      nameAR: 'أحمد محمود',
      nameEN: 'Ahmed Mahmoud',
      titleAR: 'مدير المبيعات',
      titleEN: 'Sales Manager',
      phone: '+20 100 111 2222',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
    },
    {
      nameAR: 'محمد علي',
      nameEN: 'Mohamed Ali',
      titleAR: 'مدير الدعم الفني',
      titleEN: 'Technical Support Manager',
      phone: '+20 100 333 4444',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
    },
    {
      nameAR: 'عمر حسن',
      nameEN: 'Omar Hassan',
      titleAR: 'مدير العمليات',
      titleEN: 'Operations Manager',
      phone: '+20 100 555 6666',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Breadcrumbs */}
      <div className="bg-[#F8F9FA] py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-400">{isRTL ? 'من نحن' : 'About Us'}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-[#1C1F2A]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80" 
            alt="Corporate Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1F2A]/50 to-[#1C1F2A]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {isRTL ? 'نماء المتحدة للتجارة والتوزيع' : 'Namā United Trading & Distribution'}
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-8 border-s-4 border-primary ps-6">
              {isRTL 
                ? 'رؤية طموحة انطلقت لترسيخ معايير جديدة في قطاع استيراد وتوزيع قطع غيار السيارات في السوق المصري. نحن لا نبيع قطع غيار فحسب، بل نبني جسوراً من الثقة والشراكة الاستراتيجية مع عملائنا وموزعينا.' 
                : 'An ambitious vision to establish new standards in the auto parts import and distribution sector in the Egyptian market. We don\'t just sell parts; we build bridges of trust and strategic partnership.'}
            </p>
          </div>
        </div>
      </section>

      {/* Chairman Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Image Box */}
            <div className="w-full lg:w-5/12">
              <div className="relative">
                <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-3xl -z-10"></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for Chairman's Photo */}
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" 
                    alt="Mr. Sherif Fikry" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Name Badge */}
                <div className="absolute -bottom-6 -start-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-w-[250px]">
                  <h3 className="text-2xl font-black text-[#1C1C1C] mb-1">
                    {isRTL ? 'أ. شريف فكري' : 'Mr. Sherif Fikry'}
                  </h3>
                  <p className="text-primary font-bold text-sm uppercase tracking-wider">
                    {isRTL ? 'رئيس مجلس الإدارة' : 'Chairman of the Board'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Box */}
            <div className="w-full lg:w-7/12 pt-10 lg:pt-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-primary rounded-full"></div>
                <h2 className="text-3xl font-black text-[#1C1C1C]">
                  {isRTL ? 'كلمة رئيس مجلس الإدارة' : 'Chairman\'s Message'}
                </h2>
              </div>
              
              <div className="prose prose-lg text-gray-600 font-medium">
                <p className="mb-6 leading-relaxed">
                  {isRTL 
                    ? '"منذ انطلاقنا في نماء المتحدة، وضعنا نصب أعيننا هدفاً واضحاً: أن نكون شركاء النجاح الأوائل لكل تاجر ومركز صيانة في مصر. ندرك تماماً التحديات التي يواجهها السوق، ولذلك أخذنا على عاتقنا توفير قطع غيار ذات جودة عالمية، وبأسعار تنافسية، مدعومة بضمان حقيقي وتكنولوجيا حديثة تسهل من مهام عملائنا اليومية."'
                    : '"Since the launch of Namā United, we set a clear goal: to be the primary success partners for every dealer and service center in Egypt. We fully understand the market challenges, which is why we committed to providing world-class quality parts at competitive prices, backed by real warranties and modern technology."'}
                </p>
                <p className="leading-relaxed mb-8">
                  {isRTL
                    ? '"إن نجاح نماء المتحدة لا يقاس بحجم مبيعاتها، بل بحجم الثقة التي يوليها لنا وكلاؤنا المعتمدون في كافة محافظات الجمهورية. نحن ملتزمون بمواصلة الابتكار واستقطاب أفضل التوكيلات العالمية لنحافظ على الصدارة، وندفع بعجلة سوق السيارات المصري نحو آفاق جديدة من الجودة والاحترافية."'
                    : '"The success of Namā United is not measured by its sales volume, but by the level of trust our authorized dealers place in us across the country. We are committed to continuing innovation and attracting the best global brands to maintain our leadership."'}
                </p>
                
                {/* Signature Signature */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="font-['Brush_Script_MT',cursive] text-4xl text-gray-400 opacity-60">
                    Sherif Fikry
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#1C1C1C] mb-4">
              {isRTL ? 'قيمنا المؤسسية' : 'Our Core Values'}
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              {isRTL 
                ? 'المبادئ التي تقود عملياتنا اليومية وتوجه قراراتنا الاستراتيجية.' 
                : 'The principles that guide our daily operations and strategic decisions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white text-primary transition-colors">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-black text-[#1C1C1C] mb-4">
                  {isRTL ? value.titleAR : value.titleEN}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {isRTL ? value.descAR : value.descEN}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#1C1C1C] mb-4">
              {isRTL ? 'فريق العمل' : 'Our Team'}
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              {isRTL 
                ? 'الكوادر والخبرات التي تقف خلف نجاح نماء المتحدة.' 
                : 'The talents and expertise behind the success of Namā United.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group rounded-3xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] w-full bg-gray-100">
                  <img 
                    src={member.image} 
                    alt={isRTL ? member.nameAR : member.nameEN} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pt-20 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-black text-white mb-1">
                    {isRTL ? member.nameAR : member.nameEN}
                  </h3>
                  <p className="text-primary font-bold text-sm uppercase tracking-wider mb-4">
                    {isRTL ? member.titleAR : member.titleEN}
                  </p>
                  
                  {/* Contact Number */}
                  <div className="flex items-center gap-2 text-white/90 bg-white/10 w-fit px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                    <Phone size={16} className="text-[#FFB300]" />
                    <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="font-bold text-sm tracking-wide" dir="ltr">
                      {member.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action for Joining */}
          <div className="mt-20 bg-[#1C1F2A] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10">
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
             </div>
             <div className="relative z-10">
               <h3 className="text-3xl font-black text-white mb-6">
                 {isRTL ? 'انضم لشركاء النجاح' : 'Join Our Partners of Success'}
               </h3>
               <p className="text-gray-400 font-medium mb-8 max-w-2xl mx-auto text-lg">
                 {isRTL 
                   ? 'إذا كنت تاجر تجزئة أو مركز صيانة، فنحن ندعوك للانضمام لشبكة الموزعين المعتمدين والاستفادة من باقات الأسعار المتميزة والدعم الفني الكامل.'
                   : 'If you are a retailer or service center, we invite you to join our authorized dealers network and benefit from premium pricing and full support.'}
               </p>
               <Link 
                 to="/dealers"
                 className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg"
               >
                 {isRTL ? 'انضم كموزع معتمد' : 'Join as Authorized Dealer'}
                 <ChevronRight size={20} className={isRTL ? 'rotate-180' : ''} />
               </Link>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutPage;
