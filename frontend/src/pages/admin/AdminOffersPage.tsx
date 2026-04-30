import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit2, Trash2, X, Tag, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

interface Offer {
  id: string;
  partNumber: string;
  oeNumber: string;
  name: string;
  brand: string;
  category: string;
  packageType: string;
  moq: number;
  oldPrice: number;
  newPrice: number;
  stockInfo: string;
  isActive: boolean;
  image?: string | null;
}

const AdminOffersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    partNumber: '',
    oeNumber: '',
    name: '',
    brand: '',
    category: '',
    packageType: '',
    moq: '',
    oldPrice: '',
    newPrice: '',
    stockInfo: '',
    isActive: true,
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/offers');
      setOffers(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch offers', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenModal = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        partNumber: offer.partNumber,
        oeNumber: offer.oeNumber,
        name: offer.name,
        brand: offer.brand,
        category: offer.category,
        packageType: offer.packageType,
        moq: offer.moq.toString(),
        oldPrice: offer.oldPrice.toString(),
        newPrice: offer.newPrice.toString(),
        stockInfo: offer.stockInfo,
        isActive: offer.isActive,
        image: offer.image || ''
      });
    } else {
      setEditingOffer(null);
      setFormData({
        partNumber: '', oeNumber: '', name: '', brand: '', category: '',
        packageType: '', moq: '', oldPrice: '', newPrice: '', stockInfo: '', isActive: true, image: ''
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
      if (editingOffer) {
        await api.put(`/offers/${editingOffer.id}`, formData);
      } else {
        await api.post('/offers', formData);
      }
      setIsModalOpen(false);
      fetchOffers();
    } catch (error) {
      console.error('Failed to save offer', error);
      alert('Error saving offer.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا العرض؟' : 'Are you sure you want to delete this offer?')) {
      try {
        await api.delete(`/offers/${id}`);
        fetchOffers();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const filteredOffers = offers.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'إدارة العروض' : 'Offers Management'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? `إجمالي العروض: ${offers.length}` : `Total Offers: ${offers.length}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث باسم العرض أو رقم القطعة...' : 'Search by name or part number...'}
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
            {isRTL ? 'إضافة عرض' : 'Add Offer'}
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500 py-10">Loading...</p>
        ) : filteredOffers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-gray-100">
            <Tag size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">{isRTL ? 'لا توجد عروض' : 'No offers found'}</p>
          </div>
        ) : (
          filteredOffers.map(offer => (
            <div key={offer.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button onClick={() => handleOpenModal(offer)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(offer.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
              </div>
              
              <div className="h-48 bg-gray-50 relative flex items-center justify-center p-4">
                {offer.image ? (
                  <img src={offer.image} alt={offer.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}
                {offer.oldPrice > offer.newPrice && (
                  <div className="absolute top-4 start-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    {Math.round(((offer.oldPrice - offer.newPrice) / offer.oldPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-gray-400 font-bold mb-1">{offer.brand} • {offer.category}</div>
                <h3 className="font-black text-lg text-[#1C1C1C] mb-2 line-clamp-2">{offer.name}</h3>
                <div className="text-sm text-gray-500 font-medium mb-4">{offer.partNumber} / {offer.oeNumber}</div>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{offer.packageType}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-primary">EGP {offer.newPrice.toLocaleString()}</span>
                        <span className="text-sm font-bold text-gray-400 line-through">EGP {offer.oldPrice.toLocaleString()}</span>
                      </div>
                    </div>
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
                {editingOffer ? (isRTL ? 'تعديل العرض' : 'Edit Offer') : (isRTL ? 'إضافة عرض جديد' : 'Add New Offer')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="offerForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {isRTL ? 'صورة العرض' : 'Offer Image'}
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.image ? (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 p-2">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'اسم المنتج في العرض' : 'Product Name'} *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'رقم القطعة (Internal)' : 'Part Number'} *</label>
                    <input type="text" required value={formData.partNumber} onChange={e => setFormData({...formData, partNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'رقم الشاسيه (OE Number)' : 'OE Number'} *</label>
                    <input type="text" required value={formData.oeNumber} onChange={e => setFormData({...formData, oeNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'الماركة' : 'Brand'} *</label>
                    <input type="text" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'القسم' : 'Category'} *</label>
                    <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'نوع التعبئة' : 'Package Type'} *</label>
                    <input type="text" required value={formData.packageType} placeholder="مثال: كرتونة (12 طقم)" onChange={e => setFormData({...formData, packageType: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order Quantity'} *</label>
                    <input type="number" required min="1" value={formData.moq} onChange={e => setFormData({...formData, moq: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'السعر القديم' : 'Old Price'} *</label>
                    <input type="number" required min="0" step="0.01" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">{isRTL ? 'السعر الجديد (سعر العرض)' : 'New Price (Offer Price)'} *</label>
                    <input type="number" required min="0" step="0.01" value={formData.newPrice} onChange={e => setFormData({...formData, newPrice: e.target.value})} className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-primary font-bold" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRTL ? 'حالة المخزون' : 'Stock Info'} *</label>
                    <input type="text" required value={formData.stockInfo} placeholder="مثال: متاح 50 كرتونة" onChange={e => setFormData({...formData, stockInfo: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 md:col-span-2">
                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-primary focus:ring-primary rounded border-gray-300" />
                    <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">{isRTL ? 'عرض نشط' : 'Active Offer'}</label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" form="offerForm" disabled={isUploading} className="bg-primary hover:bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                {isRTL ? 'حفظ العرض' : 'Save Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffersPage;
