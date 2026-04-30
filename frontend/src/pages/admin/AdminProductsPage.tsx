import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit2, Trash2, X, Package } from 'lucide-react';
import api from '../../services/api';

interface Product {
  id: string;
  partNumber: string;
  name_ar: string;
  name_en: string;
  brand: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  isActive: boolean;
  image?: string | null;
}

const AdminProductsPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    partNumber: '',
    name_ar: '',
    name_en: '',
    brand: '',
    category: '',
    retailPrice: '',
    wholesalePrice: '',
    stock: '',
    isActive: true,
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/products?page=${page}&limit=10&q=${searchTerm}`);
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [searchTerm]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        partNumber: product.partNumber,
        name_ar: product.name_ar,
        name_en: product.name_en,
        brand: product.brand,
        category: product.category,
        retailPrice: product.retailPrice.toString(),
        wholesalePrice: product.wholesalePrice.toString(),
        stock: product.stock.toString(),
        isActive: product.isActive,
        image: product.image || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        partNumber: '', name_ar: '', name_en: '', brand: '', category: '',
        retailPrice: '', wholesalePrice: '', stock: '', isActive: true, image: ''
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
      const payload = {
        ...formData,
        retailPrice: Number(formData.retailPrice),
        wholesalePrice: Number(formData.wholesalePrice),
        stock: Number(formData.stock)
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Error saving product. Make sure backend is running.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  // Backend already handles filtering via searchTerm, so we don't strictly need frontend filtering, 
  // but we keep it for any immediate local updates.
  const filteredProducts = products;

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'إدارة المنتجات' : 'Products Management'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `إجمالي المنتجات: ${products.length}` : `Total Products: ${products.length}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث برقم القطعة أو الاسم...' : 'Search by part number or name...'}
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
            {isRTL ? 'إضافة منتج' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'رقم القطعة' : 'Part Number'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'اسم المنتج' : 'Product Name'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'الماركة' : 'Brand'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'سعر التجزئة' : 'Retail Price'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-primary">{isRTL ? 'سعر الجملة' : 'Wholesale Price'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'المخزون' : 'Stock'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">{isRTL ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 font-medium">
                    {isRTL ? 'جاري التحميل...' : 'Loading...'}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Package size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">{isRTL ? 'لا توجد منتجات مطابقة' : 'No products found'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#1C1C1C]" dir="ltr">{product.partNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1C1C1C]">{isRTL ? product.name_ar : product.name_en}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.brand}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-600">EGP {product.retailPrice}</td>
                    <td className="px-6 py-4 font-black text-primary">EGP {product.wholesalePrice}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button 
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              {isRTL ? 'السابق' : 'Previous'}
            </button>
            <div className="text-sm font-bold text-gray-500">
              {isRTL ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
            </div>
            <button 
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              {isRTL ? 'التالي' : 'Next'}
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-black text-[#1C1C1C]">
                {editingProduct 
                  ? (isRTL ? 'تعديل منتج' : 'Edit Product') 
                  : (isRTL ? 'إضافة منتج جديد' : 'Add New Product')}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-[#1C1C1C] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {isRTL ? 'صورة المنتج' : 'Product Image'}
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <img src={`http://localhost:4000${formData.image}`} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {isUploading && <p className="text-xs text-primary mt-2">Uploading...</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OE Number */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isRTL ? 'رقم القطعة (OE Number)' : 'Part Number (OE)'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" required
                      value={formData.partNumber}
                      onChange={e => setFormData({...formData, partNumber: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                      dir="ltr"
                    />
                  </div>
                  
                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isRTL ? 'الماركة' : 'Brand'} <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{isRTL ? 'اختر الماركة...' : 'Select Brand...'}</option>
                      <option value="Borsehung">Borsehung</option>
                      <option value="Vika">Vika</option>
                      <option value="DPA">DPA</option>
                      <option value="KDD">KDD</option>
                    </select>
                  </div>

                  {/* Name AR */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isRTL ? 'اسم المنتج (عربي)' : 'Name (AR)'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" required
                      value={formData.name_ar}
                      onChange={e => setFormData({...formData, name_ar: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Name EN */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isRTL ? 'اسم المنتج (إنجليزي)' : 'Name (EN)'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" required
                      value={formData.name_en}
                      onChange={e => setFormData({...formData, name_en: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                      dir="ltr"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isRTL ? 'القسم' : 'Category'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isRTL ? 'الكمية في المخزن' : 'Stock'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" required min="0"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Retail Price */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isRTL ? 'سعر التجزئة (EGP)' : 'Retail Price (EGP)'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" required min="0" step="0.01"
                      value={formData.retailPrice}
                      onChange={e => setFormData({...formData, retailPrice: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Wholesale Price */}
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {isRTL ? 'سعر الجملة (EGP)' : 'Wholesale Price (EGP)'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" required min="0" step="0.01"
                      value={formData.wholesalePrice}
                      onChange={e => setFormData({...formData, wholesalePrice: e.target.value})}
                      className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-primary font-bold"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="md:col-span-2 flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 text-primary focus:ring-primary rounded border-gray-300"
                    />
                    <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">
                      {isRTL ? 'المنتج نشط ومتاح للبيع' : 'Product is active and available for sale'}
                    </label>
                  </div>

                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                type="submit"
                form="productForm"
                className="px-6 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-xl font-bold transition-colors"
              >
                {isRTL ? 'حفظ المنتج' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;
