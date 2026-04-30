import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title_ar: 'كيف تختار زيت المحرك المناسب لسيارتك؟',
    title_en: 'How to Choose the Right Engine Oil?',
    excerpt_ar: 'تعرف على أهم العوامل التي تساعدك في اختيار الزيت المناسب لمحرك سيارتك...',
    excerpt_en: 'Learn the most important factors to help you choose the right oil...',
    category_ar: 'صيانة المحرك',
    category_en: 'Engine Maintenance',
    image: 'https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?w=300&q=80&auto=format',
  },
  {
    id: 2,
    title_ar: 'متى يجب تغيير فحمات الفرامل؟',
    title_en: 'When to Change Brake Pads?',
    excerpt_ar: 'علامات تدل على ضرورة تغيير فحمات الفرامل للحفاظ على سلامتك...',
    excerpt_en: 'Signs indicating the need to change brake pads for your safety...',
    category_ar: 'نظام الفرامل',
    category_en: 'Brake System',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&auto=format',
  },
  {
    id: 3,
    title_ar: 'أهمية الصيانة الدورية لسيارتك',
    title_en: 'Importance of Regular Maintenance',
    excerpt_ar: 'الصيانة الدورية تحافظ على أداء سيارتك وتطيل من عمرها الافتراضي...',
    excerpt_en: 'Regular maintenance keeps your car performing well and extends its life...',
    category_ar: 'نصائح عامة',
    category_en: 'General Tips',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=300&q=80&auto=format',
  },
];

const BlogSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section id="blog" className="py-12 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="w-full text-center">
            <h2 className="text-3xl font-black text-[#1C1C1C]">
              {isRTL ? 'نصائح وصيانة' : 'Tips & Maintenance'}
            </h2>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <Link to="/blog" className="text-[13px] font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
              {isRTL ? 'عرض كل المقالات' : 'View all articles'}
              <ChevronLeft size={16} />
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir={isRTL ? "rtl" : "ltr"}>
          {BLOG_POSTS.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex border border-gray-100">
              
              {/* Image (Right side in RTL) */}
              <div className="w-2/5 shrink-0 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={isRTL ? post.title_ar : post.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content (Left side in RTL) */}
              <div className="w-3/5 p-4 flex flex-col">
                <span className="text-[11px] font-bold text-primary mb-2">
                  {isRTL ? post.category_ar : post.category_en}
                </span>
                
                <h3 className="font-bold text-[#1C1C1C] text-[15px] leading-snug mb-2 group-hover:text-primary transition-colors">
                  {isRTL ? post.title_ar : post.title_en}
                </h3>
                
                <p className="text-gray-500 text-[13px] leading-relaxed mb-4 line-clamp-2">
                  {isRTL ? post.excerpt_ar : post.excerpt_en}
                </p>

                <div className="mt-auto flex justify-start">
                  <span className="text-[13px] font-bold text-gray-500 flex items-center gap-1 group-hover:text-primary transition-colors">
                    {isRTL ? 'اقرأ المزيد' : 'Read more'}
                    <ChevronLeft size={14} className="mt-0.5" />
                  </span>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;
