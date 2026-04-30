import { useTranslation } from 'react-i18next';
import { Star, Quote, Building2, Wrench } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'مؤسسة التوفيق للتجارة',
    role: 'تاجر جملة - القاهرة',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80',
    text: 'تعاملنا مع NUTD نقل مبيعاتنا لمستوى آخر. توفير قطع Borsehung و Vika بأسعار الجملة التنافسية وسرعة التوصيل لا مثيل لها.',
    rating: 5,
    type: 'dealer'
  },
  {
    id: 2,
    name: 'م. أحمد سعيد',
    role: 'مدير مركز صيانة معتمد',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=150&q=80',
    text: 'كعاملين في مجال الصيانة، جودة القطع هي رأس مالنا. لم نواجه أي مشكلة في المرتجعات مع قطع الغيار من نماء، الضمان حقيقي وفعال.',
    rating: 5,
    type: 'mechanic'
  },
  {
    id: 3,
    name: 'أوتو ماركت الرضوان',
    role: 'موزع معتمد - الإسكندرية',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
    text: 'لوحة تحكم التجار (B2B) سهلت علينا طلب النواقص ومتابعة الحسابات. دعم فني احترافي متواجد دائماً لحل أي مشكلة.',
    rating: 4.8,
    type: 'dealer'
  }
];

const Testimonials = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="py-20 bg-white relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 rounded-l-[100px] -z-10 transform translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#1C1C1C] mb-6 leading-tight">
            {isRTL ? 'شركاء النجاح يثقون بنا' : 'Success Partners Trust Us'}
          </h2>
          <p className="text-gray-500 font-bold text-lg">
            {isRTL 
              ? 'نفخر بخدمة أكثر من 500 تاجر ومركز صيانة على مستوى الجمهورية بتقديم أفضل قطع الغيار والخدمات.' 
              : 'We are proud to serve over 500 dealers and service centers nationwide with the best parts and services.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map(review => (
            <div key={review.id} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300">
              {/* Quote Icon Background */}
              <Quote size={60} className={`absolute ${isRTL ? 'top-6 left-6' : 'top-6 right-6'} text-gray-100 -z-0 transform ${isRTL ? 'rotate-180' : ''}`} />
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < Math.floor(review.rating) ? "text-[#FFB300] fill-current" : "text-gray-200"} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 font-medium leading-relaxed mb-8 relative z-10 text-lg">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-gray-100">
                <div className="relative">
                  <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100 text-primary">
                    {review.type === 'dealer' ? <Building2 size={12} /> : <Wrench size={12} />}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-[#1C1C1C]">{review.name}</h4>
                  <span className="text-xs font-bold text-gray-500">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
