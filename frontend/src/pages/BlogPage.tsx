import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import SEO from '../components/seo/SEO';

const CATEGORIES = ['الكل', 'نصائح صيانة', 'أدلة الشراء', 'مقارنات', 'أخبار السيارات'];

const BlogPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blog');
        setBlogs(res.data.data.filter((b: any) => b.isActive));
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const featuredPost = blogs[0]; // Just take the first one as featured for now
  
  const filteredPosts = blogs.filter((post, index) => {
    const matchCategory = activeCategory === 'الكل' || post.category === activeCategory;
    const matchSearch = post.title.includes(search) || post.excerpt.includes(search);
    return index !== 0 && matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA]" dir={isRTL ? "rtl" : "ltr"}>
      <SEO title={isRTL ? 'المدونة' : 'Blog'} />
      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-900">{isRTL ? 'المدونة' : 'Blog'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1C1C1C] mb-4">
              {isRTL ? 'مدونة NUTD' : 'NUTD Blog'}
            </h1>
            <p className="text-gray-500 font-bold text-lg max-w-xl">
              {isRTL 
                ? 'دليلك الشامل لعالم صيانة السيارات وقطع الغيار. نصائح، مقارنات، وأخبار.' 
                : 'Your comprehensive guide to car maintenance and spare parts. Tips, comparisons, and news.'}
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={isRTL ? 'ابحث في المقالات...' : 'Search articles...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-12 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            />
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={20} />
          </div>
        </div>

        {/* Featured Post (Only show if search is empty and category is 'All') */}
        {featuredPost && activeCategory === 'الكل' && !search && (
          <div className="mb-16">
            <Link to={`/blog/${featuredPost.id}`} className="group relative block bg-[#1C1F2A] rounded-3xl overflow-hidden shadow-xl">
              <div className="absolute inset-0">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F2A] via-[#1C1F2A]/80 to-transparent"></div>
              </div>
              
              <div className="relative z-10 p-8 md:p-16 flex flex-col justify-end min-h-[400px] md:min-h-[500px]">
                <div className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-lg w-max mb-6">
                  {featuredPost.category}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 text-lg md:text-xl font-medium max-w-3xl mb-8 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-gray-400 font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 custom-scrollbar hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
                activeCategory === category 
                  ? 'bg-[#1C1C1C] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="py-20 text-center font-bold text-gray-500">
            {isRTL ? 'جاري التحميل...' : 'Loading...'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 start-4 bg-white/90 backdrop-blur text-[#1C1C1C] text-xs font-bold px-3 py-1 rounded-lg">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</div>
                  <div className="flex items-center gap-1.5"><User size={14} /> {post.author}</div>
                </div>
                <h3 className="text-xl font-black text-[#1C1C1C] mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-500 font-medium text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm group-hover:underline">
                  {isRTL ? 'اقرأ المزيد' : 'Read More'}
                  {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{isRTL ? 'لا توجد مقالات' : 'No articles found'}</h3>
            <p className="text-gray-500 font-medium">
              {isRTL ? 'لم نتمكن من العثور على مقالات تطابق بحثك.' : 'We couldn\'t find any articles matching your search.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogPage;
