import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Plus, Trash2, Image as ImageIcon, LayoutTemplate, Type, Shield, LayoutGrid, Upload, Car, Layers, Package } from 'lucide-react';
import api from '../../services/api';
import type { HeroSettings, FeatureSettings, PromoBannerSettings, CarMakeSettings, CategorySettings, WholesaleOfferSettings } from '../../types';
import { defaultHero, defaultFeatures, defaultBrands, defaultCarMakes, defaultCategories, defaultWholesale } from '../../utils/defaultSettings';

const AdminHomePage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'brands' | 'carmakes' | 'categories' | 'wholesale'>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [features, setFeatures] = useState<FeatureSettings[]>([]);
  const [brands, setBrands] = useState<PromoBannerSettings[]>([]);
  const [carMakes, setCarMakes] = useState<CarMakeSettings[]>([]);
  const [categories, setCategories] = useState<CategorySettings[]>([]);
  const [wholesaleOffers, setWholesaleOffers] = useState<WholesaleOfferSettings[]>([]);

  // For managing models of a specific make
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);

  // For managing subcategories of a specific category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.data) {
          const hero = JSON.parse(res.data.data.homepage_hero || '{}');
          const feats = JSON.parse(res.data.data.homepage_features || '[]');
          const bnds = JSON.parse(res.data.data.homepage_brands || '[]');
          const makes = JSON.parse(res.data.data.homepage_carmakes || '[]');
          const cats = JSON.parse(res.data.data.homepage_categories || '[]');
          const wholesale = JSON.parse(res.data.data.homepage_wholesale || '[]');

          setHeroSettings(Object.keys(hero).length > 0 ? hero : defaultHero);
          setFeatures(feats.length > 0 ? feats : defaultFeatures);
          setBrands(bnds.length > 0 ? bnds : defaultBrands);
          setCarMakes(makes.length > 0 ? makes : defaultCarMakes);
          setCategories(cats.length > 0 ? cats : defaultCategories);
          setWholesaleOffers(wholesale.length > 0 ? wholesale : defaultWholesale);
        }
      } catch (error) {
        console.error('Failed to fetch homepage settings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/settings', {
        homepage_hero: JSON.stringify(heroSettings),
        homepage_features: JSON.stringify(features),
        homepage_brands: JSON.stringify(brands),
        homepage_carmakes: JSON.stringify(carMakes),
        homepage_categories: JSON.stringify(categories),
        homepage_wholesale: JSON.stringify(wholesaleOffers)
      });
      alert(isRTL ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert(isRTL ? 'فشل في حفظ الإعدادات' : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.url) {
        callback(res.data.url);
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert(isRTL ? 'فشل رفع الصورة' : 'Image upload failed');
    }
  };

  if (isLoading || !heroSettings) {
    return <div className="p-8 text-center">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] mb-1">
            {isRTL ? 'تخصيص الصفحة الرئيسية' : 'Homepage CMS'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isRTL ? 'إدارة محتوى الصفحة الرئيسية بالكامل' : 'Manage entire homepage content'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التعديلات' : 'Save Changes')}
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'hero' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <LayoutTemplate size={18} />
          {isRTL ? 'البانر (Hero)' : 'Hero'}
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'features' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Shield size={18} />
          {isRTL ? 'المميزات' : 'Features'}
        </button>
        <button
          onClick={() => setActiveTab('brands')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'brands' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <LayoutGrid size={18} />
          {isRTL ? 'البنرات' : 'Banners'}
        </button>
        <button
          onClick={() => {
            setActiveTab('carmakes');
            setSelectedMakeId(null);
          }}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'carmakes' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Car size={18} />
          {isRTL ? 'ماركات السيارات' : 'Car Makes'}
        </button>
        <button
          onClick={() => {
            setActiveTab('categories');
            setSelectedCategoryId(null);
          }}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers size={18} />
          {isRTL ? 'فئات القطع' : 'Categories'}
        </button>
        <button
          onClick={() => setActiveTab('wholesale')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'wholesale' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package size={18} />
          {isRTL ? 'عروض الجملة' : 'Wholesale'}
        </button>
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-8">
          {/* Texts Section */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Type className="text-primary" size={24} />
              <h2 className="text-lg font-black">{isRTL ? 'النصوص' : 'Texts'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">العنوان (عربي) - يدعم HTML</label>
                <textarea
                  value={heroSettings.titleAr}
                  onChange={e => setHeroSettings({...heroSettings, titleAr: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-primary focus:outline-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title (English) - HTML Supported</label>
                <textarea
                  value={heroSettings.titleEn}
                  onChange={e => setHeroSettings({...heroSettings, titleEn: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-primary focus:outline-none"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف الفرعي (عربي)</label>
                <textarea
                  value={heroSettings.subtitleAr}
                  onChange={e => setHeroSettings({...heroSettings, subtitleAr: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 h-20 focus:ring-2 focus:ring-primary focus:outline-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle (English)</label>
                <textarea
                  value={heroSettings.subtitleEn}
                  onChange={e => setHeroSettings({...heroSettings, subtitleEn: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 h-20 focus:ring-2 focus:ring-primary focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>
          </section>

          {/* Slides Section */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-primary" size={24} />
                <h2 className="text-lg font-black">{isRTL ? 'صور السلايدر الخلفية' : 'Background Slides'}</h2>
              </div>
              <button 
                onClick={() => setHeroSettings({...heroSettings, slides: [...heroSettings.slides, { id: Date.now(), image: '' }]})}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> {isRTL ? 'إضافة صورة' : 'Add Image'}
              </button>
            </div>
            
            <div className="space-y-4">
              {heroSettings.slides.map((slide, index) => (
                <div key={slide.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0 border border-gray-300 relative group">
                    {slide.image ? <img src={slide.image} alt="Slide" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>}
                    <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload size={20} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                        const newSlides = [...heroSettings.slides];
                        newSlides[index].image = url;
                        setHeroSettings({...heroSettings, slides: newSlides});
                      })} />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={slide.image}
                      onChange={e => {
                        const newSlides = [...heroSettings.slides];
                        newSlides[index].image = e.target.value;
                        setHeroSettings({...heroSettings, slides: newSlides});
                      }}
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const newSlides = heroSettings.slides.filter(s => s.id !== slide.id);
                      setHeroSettings({...heroSettings, slides: newSlides});
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setFeatures([...features, { id: Date.now(), icon: 'Shield', titleAr: '', titleEn: '', descAr: '', descEn: '' }])}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} /> {isRTL ? 'إضافة ميزة جديدة' : 'Add Feature'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={feature.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group">
                <button 
                  onClick={() => setFeatures(features.filter(f => f.id !== feature.id))}
                  className="absolute top-4 end-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Lucide Icon Name</label>
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={e => {
                        const newF = [...features];
                        newF[index].icon = e.target.value;
                        setFeatures(newF);
                      }}
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Title (AR)</label>
                      <input type="text" value={feature.titleAr} onChange={e => { const n = [...features]; n[index].titleAr = e.target.value; setFeatures(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Title (EN)</label>
                      <input type="text" value={feature.titleEn} onChange={e => { const n = [...features]; n[index].titleEn = e.target.value; setFeatures(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="ltr" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Desc (AR)</label>
                      <input type="text" value={feature.descAr} onChange={e => { const n = [...features]; n[index].descAr = e.target.value; setFeatures(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Desc (EN)</label>
                      <input type="text" value={feature.descEn} onChange={e => { const n = [...features]; n[index].descEn = e.target.value; setFeatures(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="ltr" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'brands' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setBrands([...brands, { 
                id: Date.now(), 
                logoText: 'NEW', 
                logoColor: 'text-[#1C1C1C]', 
                taglineAr: 'عنوان جديد', 
                taglineEn: 'New Tagline', 
                descAr: 'وصف', 
                descEn: 'Desc', 
                bgColor: 'bg-gray-100', 
                btnColor: 'bg-black', 
                imgUrl: '' 
              }])}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} /> {isRTL ? 'إضافة بنر جديد' : 'Add Promo Banner'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, index) => (
              <div key={brand.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="h-32 bg-gray-100 relative group flex items-center justify-center">
                  {brand.imgUrl ? (
                    <img src={brand.imgUrl} alt="BG" className="w-full h-full object-cover mix-blend-multiply opacity-50" />
                  ) : (
                    <span className="text-gray-400 text-sm font-bold">No Background</span>
                  )}
                  <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                    <Upload size={20} className="mb-1" />
                    <span className="text-xs font-bold">Upload Background</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                      const n = [...brands]; n[index].imgUrl = url; setBrands(n);
                    })} />
                  </label>
                  <button 
                    onClick={() => setBrands(brands.filter(b => b.id !== brand.id))}
                    className="absolute top-2 end-2 text-white bg-red-500/80 hover:bg-red-500 p-1.5 rounded-lg z-20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-4 space-y-4 flex-1 flex flex-col">
                  {/* ... brand form fields same as before ... */}
                  <div className="grid grid-cols-2 gap-3 border-b border-gray-100 pb-4">
                    <div className="col-span-2 flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Logo Text</label>
                        <input type="text" value={brand.logoText || ''} onChange={e => { const n = [...brands]; n[index].logoText = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
                      </div>
                      <div className="w-16 h-10 border border-gray-200 rounded-lg bg-gray-50 relative group flex items-center justify-center overflow-hidden shrink-0">
                        {brand.logoUrl ? <img src={brand.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" /> : <ImageIcon size={16} className="text-gray-400" />}
                        <label className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <Upload size={14} />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                            const n = [...brands]; n[index].logoUrl = url; setBrands(n);
                          })} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Tagline (AR)</label>
                      <input type="text" value={brand.taglineAr} onChange={e => { const n = [...brands]; n[index].taglineAr = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Tagline (EN)</label>
                      <input type="text" value={brand.taglineEn} onChange={e => { const n = [...brands]; n[index].taglineEn = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="ltr" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Desc (AR)</label>
                      <input type="text" value={brand.descAr} onChange={e => { const n = [...brands]; n[index].descAr = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Desc (EN)</label>
                      <input type="text" value={brand.descEn} onChange={e => { const n = [...brands]; n[index].descEn = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-2 text-sm" dir="ltr" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 mt-auto">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase text-center">Bg Class</label>
                      <input type="text" value={brand.bgColor} onChange={e => { const n = [...brands]; n[index].bgColor = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs text-center" dir="ltr" placeholder="bg-[#F0F7F4]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase text-center">Btn Class</label>
                      <input type="text" value={brand.btnColor} onChange={e => { const n = [...brands]; n[index].btnColor = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs text-center" dir="ltr" placeholder="bg-[#005A3D]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase text-center">Logo Class</label>
                      <input type="text" value={brand.logoColor || ''} onChange={e => { const n = [...brands]; n[index].logoColor = e.target.value; setBrands(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs text-center" dir="ltr" placeholder="text-[#005A3D]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'carmakes' && (
        <div className="space-y-6">
          {selectedMakeId === null ? (
            <>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setCarMakes([...carMakes, { id: Date.now(), name: 'New Make', labelAr: 'ماركة جديدة', icon: '', models: [] }])}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus size={16} /> {isRTL ? 'إضافة ماركة' : 'Add Make'}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {carMakes.map((make, index) => (
                  <div key={make.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative group hover:border-primary/50 transition-colors">
                    
                    <button 
                      onClick={() => setCarMakes(carMakes.filter(m => m.id !== make.id))}
                      className="absolute top-2 end-2 text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-xl relative group/img flex items-center justify-center overflow-hidden border border-gray-100">
                      {make.icon ? <img src={make.icon} alt={make.name} className="w-10 h-10 object-contain" /> : <ImageIcon size={20} className="text-gray-300" />}
                      <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity z-10">
                        <Upload size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                          const n = [...carMakes]; n[index].icon = url; setCarMakes(n);
                        })} />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={make.name} 
                        onChange={e => { const n = [...carMakes]; n[index].name = e.target.value; setCarMakes(n); }} 
                        className="w-full border-b border-gray-200 focus:border-primary bg-transparent text-center font-bold text-sm outline-none px-1 py-0.5" 
                        placeholder="English Name" 
                        dir="ltr"
                      />
                      <input 
                        type="text" 
                        value={make.labelAr} 
                        onChange={e => { const n = [...carMakes]; n[index].labelAr = e.target.value; setCarMakes(n); }} 
                        className="w-full border-b border-gray-200 focus:border-primary bg-transparent text-center font-bold text-sm outline-none px-1 py-0.5" 
                        placeholder="الاسم بالعربي" 
                        dir="rtl"
                      />
                    </div>

                    <button 
                      onClick={() => setSelectedMakeId(make.id)}
                      className="w-full mt-4 bg-primary/10 text-primary font-bold py-1.5 rounded-lg text-xs hover:bg-primary hover:text-white transition-colors"
                    >
                      {make.models.length} {isRTL ? 'موديلات' : 'Models'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedMakeId(null)}
                    className="text-gray-500 hover:text-gray-900 font-bold"
                  >
                    &larr; {isRTL ? 'رجوع للماركات' : 'Back to Makes'}
                  </button>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <h3 className="text-xl font-black text-primary">
                    {carMakes.find(m => m.id === selectedMakeId)?.name} Models
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    const makeIdx = carMakes.findIndex(m => m.id === selectedMakeId);
                    if (makeIdx > -1) {
                      const n = [...carMakes];
                      n[makeIdx].models.push({ id: Date.now(), name: 'New Model', labelAr: 'موديل جديد', image: '' });
                      setCarMakes(n);
                    }
                  }}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus size={16} /> {isRTL ? 'إضافة موديل' : 'Add Model'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {carMakes.find(m => m.id === selectedMakeId)?.models.map((model, mIndex) => {
                  const makeIdx = carMakes.findIndex(m => m.id === selectedMakeId);
                  
                  return (
                    <div key={model.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 relative group">
                      <button 
                        onClick={() => {
                          const n = [...carMakes];
                          n[makeIdx].models = n[makeIdx].models.filter(md => md.id !== model.id);
                          setCarMakes(n);
                        }}
                        className="absolute top-2 end-2 text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="w-full aspect-[4/3] bg-white rounded-xl mb-4 relative group/img flex items-center justify-center overflow-hidden border border-gray-200">
                        {model.image ? <img src={model.image} alt={model.name} className="w-full h-full object-cover mix-blend-multiply" /> : <Car size={32} className="text-gray-300" />}
                        <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity z-10">
                          <Upload size={20} className="mb-2" />
                          <span className="text-xs font-bold">Upload Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                            const n = [...carMakes];
                            n[makeIdx].models[mIndex].image = url;
                            setCarMakes(n);
                          })} />
                        </label>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">Model Name (EN)</label>
                          <input 
                            type="text" 
                            value={model.name} 
                            onChange={e => { const n = [...carMakes]; n[makeIdx].models[mIndex].name = e.target.value; setCarMakes(n); }} 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" 
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">Model Name (AR)</label>
                          <input 
                            type="text" 
                            value={model.labelAr} 
                            onChange={e => { const n = [...carMakes]; n[makeIdx].models[mIndex].labelAr = e.target.value; setCarMakes(n); }} 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" 
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {carMakes.find(m => m.id === selectedMakeId)?.models.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400 font-bold">
                    No models added yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          {selectedCategoryId === null ? (
            <>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setCategories([...categories, { id: `cat_${Date.now()}`, nameEN: 'New Category', nameAR: 'قسم جديد', image: '', subcategories: [] }])}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus size={16} /> {isRTL ? 'إضافة قسم رئيسي' : 'Add Category'}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, index) => (
                  <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative group hover:border-primary/50 transition-colors">
                    
                    <button 
                      onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}
                      className="absolute top-2 end-2 text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="w-20 h-20 mx-auto mb-3 bg-gray-50 rounded-xl relative group/img flex items-center justify-center overflow-hidden border border-gray-100 p-2">
                      {cat.image ? <img src={cat.image} alt={cat.nameEN} className="w-full h-full object-contain mix-blend-multiply" /> : <ImageIcon size={24} className="text-gray-300" />}
                      <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity z-10">
                        <Upload size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                          const n = [...categories]; n[index].image = url; setCategories(n);
                        })} />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={cat.id} 
                        onChange={e => { const n = [...categories]; n[index].id = e.target.value; setCategories(n); }} 
                        className="w-full border-b border-gray-200 focus:border-primary bg-transparent text-center font-bold text-[10px] text-gray-400 outline-none px-1 py-0.5" 
                        placeholder="Category ID (e.g. engine)" 
                        dir="ltr"
                      />
                      <input 
                        type="text" 
                        value={cat.nameEN} 
                        onChange={e => { const n = [...categories]; n[index].nameEN = e.target.value; setCategories(n); }} 
                        className="w-full border-b border-gray-200 focus:border-primary bg-transparent text-center font-bold text-sm outline-none px-1 py-0.5" 
                        placeholder="English Name" 
                        dir="ltr"
                      />
                      <input 
                        type="text" 
                        value={cat.nameAR} 
                        onChange={e => { const n = [...categories]; n[index].nameAR = e.target.value; setCategories(n); }} 
                        className="w-full border-b border-gray-200 focus:border-primary bg-transparent text-center font-bold text-sm outline-none px-1 py-0.5" 
                        placeholder="الاسم بالعربي" 
                        dir="rtl"
                      />
                    </div>

                    <button 
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="w-full mt-4 bg-primary/10 text-primary font-bold py-1.5 rounded-lg text-xs hover:bg-primary hover:text-white transition-colors"
                    >
                      {cat.subcategories?.length || 0} {isRTL ? 'أقسام فرعية' : 'Subcategories'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedCategoryId(null)}
                    className="text-gray-500 hover:text-gray-900 font-bold"
                  >
                    &larr; {isRTL ? 'رجوع للأقسام' : 'Back to Categories'}
                  </button>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <h3 className="text-xl font-black text-primary">
                    {categories.find(c => c.id === selectedCategoryId)?.nameEN} Subcategories
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    const catIdx = categories.findIndex(c => c.id === selectedCategoryId);
                    if (catIdx > -1) {
                      const n = [...categories];
                      if(!n[catIdx].subcategories) n[catIdx].subcategories = [];
                      n[catIdx].subcategories.push({ id: `sub_${Date.now()}`, nameEN: 'New Sub', nameAR: 'قسم فرعي', image: '' });
                      setCategories(n);
                    }
                  }}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus size={16} /> {isRTL ? 'إضافة قسم فرعي' : 'Add Subcategory'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.find(c => c.id === selectedCategoryId)?.subcategories?.map((sub, sIndex) => {
                  const catIdx = categories.findIndex(c => c.id === selectedCategoryId);
                  
                  return (
                    <div key={sub.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 relative group">
                      <button 
                        onClick={() => {
                          const n = [...categories];
                          n[catIdx].subcategories = n[catIdx].subcategories.filter(s => s.id !== sub.id);
                          setCategories(n);
                        }}
                        className="absolute top-2 end-2 text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="w-full aspect-square bg-white rounded-xl mb-4 relative group/img flex items-center justify-center overflow-hidden border border-gray-200 p-4">
                        {sub.image ? <img src={sub.image} alt={sub.nameEN} className="w-full h-full object-contain mix-blend-multiply" /> : <Layers size={32} className="text-gray-300" />}
                        <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity z-10">
                          <Upload size={20} className="mb-2" />
                          <span className="text-xs font-bold">Upload Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                            const n = [...categories];
                            n[catIdx].subcategories[sIndex].image = url;
                            setCategories(n);
                          })} />
                        </label>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">Subcategory ID</label>
                          <input 
                            type="text" 
                            value={sub.id} 
                            onChange={e => { const n = [...categories]; n[catIdx].subcategories[sIndex].id = e.target.value; setCategories(n); }} 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 focus:border-primary outline-none" 
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">Name (EN)</label>
                          <input 
                            type="text" 
                            value={sub.nameEN} 
                            onChange={e => { const n = [...categories]; n[catIdx].subcategories[sIndex].nameEN = e.target.value; setCategories(n); }} 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" 
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-1">Name (AR)</label>
                          <input 
                            type="text" 
                            value={sub.nameAR} 
                            onChange={e => { const n = [...categories]; n[catIdx].subcategories[sIndex].nameAR = e.target.value; setCategories(n); }} 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" 
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {(!categories.find(c => c.id === selectedCategoryId)?.subcategories || categories.find(c => c.id === selectedCategoryId)!.subcategories.length === 0) && (
                  <div className="col-span-full py-12 text-center text-gray-400 font-bold">
                    No subcategories added yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'wholesale' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setWholesaleOffers([...wholesaleOffers, { 
                id: `wh_${Date.now()}`, 
                name: 'New Offer', 
                brand: 'Brand', 
                oeNumber: '', 
                partNumber: '', 
                packageType: 'كرتونة', 
                moq: 1, 
                oldPrice: 0, 
                newPrice: 0, 
                savings: 0, 
                stock: 'متاح', 
                image: '' 
              }])}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} /> {isRTL ? 'إضافة عرض جملة' : 'Add Wholesale Offer'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wholesaleOffers.map((offer, index) => (
              <div key={offer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative group">
                <button 
                  onClick={() => setWholesaleOffers(wholesaleOffers.filter(o => o.id !== offer.id))}
                  className="absolute top-2 end-2 text-white bg-red-500/80 hover:bg-red-500 p-1.5 rounded-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>

                <div className="flex flex-col sm:flex-row p-4 gap-4 bg-gray-50/50">
                  <div className="w-full sm:w-32 h-32 bg-white rounded-xl relative group/img flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                    {offer.image ? <img src={offer.image} alt="Offer" className="w-full h-full object-cover mix-blend-multiply" /> : <Package size={24} className="text-gray-300" />}
                    <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity z-10">
                      <Upload size={16} className="mb-1" />
                      <span className="text-[10px] font-bold">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => {
                        const n = [...wholesaleOffers]; n[index].image = url; setWholesaleOffers(n);
                      })} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Name</label>
                        <input type="text" value={offer.name} onChange={e => { const n = [...wholesaleOffers]; n[index].name = e.target.value; setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Brand</label>
                        <input type="text" value={offer.brand} onChange={e => { const n = [...wholesaleOffers]; n[index].brand = e.target.value; setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:border-primary outline-none" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">OE Number</label>
                        <input type="text" value={offer.oeNumber} onChange={e => { const n = [...wholesaleOffers]; n[index].oeNumber = e.target.value; setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs font-mono focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Part Number</label>
                        <input type="text" value={offer.partNumber} onChange={e => { const n = [...wholesaleOffers]; n[index].partNumber = e.target.value; setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs font-mono focus:border-primary outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 border-t border-gray-100 flex-1">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Package Type (e.g. كرتونة)</label>
                      <input type="text" value={offer.packageType} onChange={e => { const n = [...wholesaleOffers]; n[index].packageType = e.target.value; setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">MOQ</label>
                      <input type="number" value={offer.moq} onChange={e => { const n = [...wholesaleOffers]; n[index].moq = Number(e.target.value); setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:border-primary outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Old Price</label>
                      <input type="number" value={offer.oldPrice} onChange={e => { const n = [...wholesaleOffers]; n[index].oldPrice = Number(e.target.value); setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">New Price</label>
                      <input type="number" value={offer.newPrice} onChange={e => { const n = [...wholesaleOffers]; n[index].newPrice = Number(e.target.value); n[index].savings = n[index].oldPrice - n[index].newPrice; setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Savings</label>
                      <input type="number" value={offer.savings} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg p-1.5 text-xs text-orange-600 font-bold outline-none cursor-not-allowed" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Stock Status (e.g. متاح 50 كرتونة)</label>
                    <input type="text" value={offer.stock} onChange={e => { const n = [...wholesaleOffers]; n[index].stock = e.target.value; setWholesaleOffers(n); }} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:border-primary outline-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHomePage;
