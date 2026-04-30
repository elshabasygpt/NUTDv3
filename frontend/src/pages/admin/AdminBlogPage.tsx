import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit2, Trash2, X, FileText, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string | null;
  author: string;
  category: string;
  date: string;
  isActive: boolean;
}

const AdminBlogPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    isActive: true,
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/blog');
      setBlogs(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        category: blog.category,
        date: blog.date,
        isActive: blog.isActive,
        image: blog.image || ''
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '', excerpt: '', content: '', author: '', category: '',
        date: new Date().toISOString().split('T')[0], isActive: true, image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setIsUploading(true);
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image: res.data.url }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await api.put(`/blog/${editingBlog.id}`, formData);
      } else {
        await api.post('/blog', formData);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error('Failed to save blog', error);
      alert('Error saving blog.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/blog/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'إدارة المدونة' : 'Blog Management'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `إجمالي المقالات: ${blogs.length}` : `Total Posts: ${blogs.length}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث بعنوان المقال...' : 'Search by title...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            {isRTL ? 'إضافة مقال' : 'Add Post'}
          </button>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500 py-10">Loading...</p>
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-gray-100">
            <FileText size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">{isRTL ? 'لا توجد مقالات' : 'No posts found'}</p>
          </div>
        ) : (
          filteredBlogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 bg-gray-100 relative">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-primary">
                  {blog.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{blog.excerpt}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="text-xs text-gray-400 font-medium">
                    {blog.date} • {blog.author}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(blog)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(blog.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-black text-[#1C1C1C]">
                {editingBlog ? (isRTL ? 'تعديل المقال' : 'Edit Post') : (isRTL ? 'إضافة مقال جديد' : 'Add New Post')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {isRTL ? 'صورة الغلاف' : 'Cover Image'}
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.image ? (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={14}/></button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 shrink-0">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <input 
                      type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {isUploading && <p className="text-xs text-primary mt-2">Uploading...</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'عنوان المقال' : 'Post Title'} *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'مقتطف (Excerpt)' : 'Excerpt'} *</label>
                    <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'المحتوى (Content)' : 'Content'} *</label>
                    <textarea required rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'القسم' : 'Category'} *</label>
                    <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'اسم الكاتب' : 'Author'} *</label>
                    <input type="text" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'تاريخ النشر' : 'Date'} *</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div className="flex items-center gap-3 mt-8">
                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-primary focus:ring-primary rounded border-gray-300" />
                    <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">{isRTL ? 'نشر المقال' : 'Publish Post'}</label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" form="blogForm" disabled={isUploading} className="bg-primary hover:bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                {isRTL ? 'حفظ المقال' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogPage;
