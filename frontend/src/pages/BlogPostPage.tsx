import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User, ChevronRight, Share2, ShoppingCart, Tag } from 'lucide-react';
import api from '../services/api';
import SEO from '../components/seo/SEO';

// Mock related products
const RELATED_PRODUCTS = [
  {
    id: '1',
    name: 'تيل فرامل أمامي سيراميك',
    brand: 'بوش (Bosch)',
    price: '850 ج.م',
    image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '2',
    name: 'طقم بوجيهات ليزر إيريديوم',
    brand: 'NGK',
    price: '1,200 ج.م',
    image: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=300',
  }
];

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [copied, setCopied] = useState(false);

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/${id}`);
        setPost(res.data.data);
      } catch (error) {
        console.error('Failed to fetch blog post', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-[#F8F9FA]">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F8F9FA]">
        <h2 className="text-3xl font-black mb-4">{isRTL ? 'المقال غير موجود' : 'Article Not Found'}</h2>
        <button onClick={() => navigate('/blog')} className="text-primary font-bold hover:underline">
          {isRTL ? 'العودة للمدونة' : 'Return to Blog'}
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <SEO 
        title={post.title} 
        description={post.excerpt} 
        image={post.image || undefined} 
      />
      {/* Article Header (Hero) */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <Link to="/blog" className="hover:text-primary transition-colors">{isRTL ? 'المدونة' : 'Blog'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-900 truncate max-w-[200px] md:max-w-md">{post.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Main Content */}
          <article className="flex-1 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="h-[400px] md:h-[500px] w-full relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-6 start-6 bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-lg">
                {post.category}
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-5xl font-black text-[#1C1C1C] mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-500 font-bold text-sm mb-10 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2"><User size={18} className="text-primary" /> {post.author}</div>
                <div className="flex items-center gap-2"><Calendar size={18} className="text-primary" /> {post.date}</div>
              </div>

              {/* Mock Rich Text Content */}
              <div className="prose prose-lg max-w-none prose-headings:font-black prose-a:text-primary prose-img:rounded-2xl text-gray-700 leading-relaxed font-medium">
                <p className="text-xl font-bold text-gray-900 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <h3 className="text-2xl font-black text-gray-900 mt-10 mb-4">أهمية اختيار القطع الأصلية</h3>
                <p>
                  إن اختيار قطع الغيار الأصلية ليس مجرد رفاهية، بل هو استثمار حقيقي في عمر سيارتك وسلامتك الشخصية. 
                  الكثير من الحوادث والأعطال المفاجئة تحدث بسبب استخدام قطع تجارية غير مطابقة للمواصفات، وخاصة في أجزاء حيوية مثل الفرامل والمحرك.
                </p>
                
                <div className="bg-blue-50 border-s-4 border-blue-500 p-6 my-8 rounded-e-2xl">
                  <p className="m-0 font-bold text-blue-900">
                    <strong>نصيحة الخبراء:</strong> تأكد دائماً من وجود العلامة المائية للشركة المصنعة واطلب من التاجر رؤية شهادة الضمان قبل التركيب.
                  </p>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mt-10 mb-4">كيف تفرق بين الأصلي والمقلد؟</h3>
                <ul className="space-y-3 mb-8 list-disc list-inside">
                  <li><strong>جودة التغليف:</strong> الشركات الكبرى تهتم بتغليف قطعها باستخدام مواد عالية الجودة وبارت نمبر (Part Number) محفور وواضح.</li>
                  <li><strong>السعر المبالغ في انخفاضه:</strong> إذا كان السعر أقل بكثير من سعر السوق، فهذه أول علامة حمراء.</li>
                  <li><strong>الوزن والملمس:</strong> القطع الأصلية غالباً ما تكون أثقل وزناً وأكثر دقة في تفاصيل التشطيب (Finishing).</li>
                </ul>

                <p>
                  في النهاية، ننصحك بالتعامل مع الموزعين المعتمدين فقط. يمكنك دائماً البحث عن الموزع الأقرب لك من خلال صفحة التجار المعتمدين في منصتنا.
                </p>
              </div>

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-black text-gray-900 text-lg">{isRTL ? 'شارك هذا المقال:' : 'Share this article:'}</span>
                <div className="flex items-center gap-3">
                  <button className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors relative"
                  >
                    <Share2 size={20} />
                    {copied && (
                      <span className="absolute -top-10 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                        {isRTL ? 'تم النسخ!' : 'Copied!'}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - Related Products */}
          <aside className="w-full lg:w-96 flex flex-col gap-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-[#1C1C1C] mb-6 flex items-center gap-2">
                <Tag size={24} className="text-primary" />
                {isRTL ? 'منتجات ذات صلة' : 'Related Products'}
              </h3>
              
              <div className="flex flex-col gap-4">
                {RELATED_PRODUCTS.map(product => (
                  <Link key={product.id} to={`/products?q=${product.name}`} className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-bold text-gray-400 mb-1">{product.brand}</span>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h4>
                      <span className="font-black text-primary">{product.price}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link to="/products" className="mt-6 w-full bg-[#1C1F2A] hover:bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <ShoppingCart size={18} />
                {isRTL ? 'تصفح المتجر' : 'Browse Store'}
              </Link>
            </div>

            {/* Banner Ad / Promotional */}
            <div className="bg-gradient-to-br from-primary to-primary-600 rounded-3xl p-8 text-white shadow-lg shadow-primary/20 text-center">
              <h3 className="text-2xl font-black mb-4">{isRTL ? 'تبحث عن قطعة أصلية؟' : 'Looking for original parts?'}</h3>
              <p className="text-primary-100 font-bold text-sm mb-6">
                {isRTL ? 'نحن نضمن لك الجودة وأفضل سعر في السوق.' : 'We guarantee quality and the best price in the market.'}
              </p>
              <Link to="/checkout" className="bg-white text-primary font-black py-3 px-6 rounded-xl block hover:scale-105 transition-transform">
                {isRTL ? 'اطلب تسعيرة الآن' : 'Request a Quote Now'}
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
