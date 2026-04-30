import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Star, ChevronLeft, ChevronRight, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

const MOCK_PRODUCTS: (Product & { originalPrice: number; discount: number })[] = [
  { id: '1', partNumber: 'BR-1234', name_ar: 'فحمات فرامل أمامي', name_en: 'Front Brake Pads', brand: 'Borsehung', category: 'Brakes', retailPrice: 125, wholesalePrice: 100, originalPrice: 160, discount: 22, rating: 4.8, reviews: 0, stock: 10, isActive: true, carMakes: [], carModels: [], createdAt: '', updatedAt: '' },
  { id: '2', partNumber: 'KD-334', name_ar: 'فلتر زيت', name_en: 'Oil Filter', brand: 'KDD', category: 'Filters', retailPrice: 45, wholesalePrice: 35, originalPrice: 65, discount: 30, rating: 4.7, reviews: 0, stock: 10, isActive: true, carMakes: [], carModels: [], createdAt: '', updatedAt: '' },
  { id: '3', partNumber: 'VK-8567', name_ar: 'مساعد أمامي', name_en: 'Front Shock Absorber', brand: 'Vika', category: 'Suspension', retailPrice: 320, wholesalePrice: 280, originalPrice: 400, discount: 20, rating: 4.9, reviews: 0, stock: 10, isActive: true, carMakes: [], carModels: [], createdAt: '', updatedAt: '' },
  { id: '4', partNumber: 'KD-1122', name_ar: 'فلتر هواء', name_en: 'Air Filter', brand: 'KDD', category: 'Filters', retailPrice: 65, wholesalePrice: 50, originalPrice: 90, discount: 28, rating: 4.6, reviews: 0, stock: 10, isActive: true, carMakes: [], carModels: [], createdAt: '', updatedAt: '' },
];

const CountdownTimer = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Fake future end time: 14 hours, 23 mins, 45 secs from now
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 23, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else clearInterval(timer); // Timer reached 0
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const TimeUnit = ({ value, labelAR, labelEN }: { value: number, labelAR: string, labelEN: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-red-50 text-red-600 font-black text-xl md:text-2xl rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-red-100 shadow-sm" dir="ltr">
        {formatNumber(value)}
      </div>
      <span className="text-[10px] md:text-xs font-bold text-gray-500 mt-1">{isRTL ? labelAR : labelEN}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 md:gap-3" dir={isRTL ? "rtl" : "ltr"}>
      <TimeUnit value={timeLeft.hours} labelAR="ساعة" labelEN="Hours" />
      <span className="text-red-600 font-black text-xl pb-4 animate-pulse">:</span>
      <TimeUnit value={timeLeft.minutes} labelAR="دقيقة" labelEN="Mins" />
      <span className="text-red-600 font-black text-xl pb-4 animate-pulse">:</span>
      <TimeUnit value={timeLeft.seconds} labelAR="ثانية" labelEN="Secs" />
    </div>
  );
};

const ProductsGrid = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Mock authentication state for B2B
  const isMerchantLoggedIn = false;
        
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <section className="py-16 bg-[#F8F9FA]" id="offers">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header - Flash Sales */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 mb-8 pb-4 gap-6" dir={isRTL ? "rtl" : "ltr"}>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 text-red-500 w-12 h-12 flex items-center justify-center rounded-xl shrink-0 animate-pulse">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#1C1C1C] flex items-center gap-2">
                  {isRTL ? 'عروض الجملة الحصرية' : 'Exclusive Wholesale Offers'}
                </h2>
                <p className="text-sm text-gray-500 font-bold mt-1 flex items-center gap-1.5">
                  <Clock size={14} />
                  {isRTL ? 'كميات محدودة للتجار' : 'Limited quantities for dealers'}
                </p>
              </div>
            </div>
            
            {/* Divider on desktop */}
            <div className="hidden md:block w-px h-12 bg-gray-200"></div>

            {/* Countdown */}
            <CountdownTimer />
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors shadow-sm">
              <ChevronRight size={20} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors shadow-sm">
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5" dir={isRTL ? "rtl" : "ltr"}>
          {MOCK_PRODUCTS.map((product) => {
            const name = isRTL ? product.name_ar : product.name_en;
            const inWishlist = wishlist.includes(product.id);
            
            // Brand Logo Colors
            const brandColor = 
              product.brand === 'Borsehung' ? 'text-[#005A3D]' :
              product.brand === 'Vika' ? 'text-[#572B2B]' :
              'text-[#0055FF]'; // KDD

            return (
              <Link key={product.id} to={`/products/${product.id}`} className="group block border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                
                {/* Image Box */}
                <div className="relative aspect-[4/3] bg-gray-50/50 p-6 flex items-center justify-center overflow-hidden">
                  
                  {/* Discount Badge (Only if logged in) */}
                  {isMerchantLoggedIn && (
                    <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-red-500 text-white font-black text-xs px-3 py-1.5 rounded-lg z-10`} dir="ltr">
                      -{product.discount}%
                    </div>
                  )}

                  <img
                    src={`https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&q=70&auto=format&seed=${product.id}`}
                    alt={name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Heart */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-white w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10`}
                  >
                    <Heart size={16} fill={inWishlist ? '#EF4444' : 'none'} className={inWishlist ? 'text-red-500' : ''} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col">
                  
                  {/* Brand Logo */}
                  <div className={`text-[13px] font-black mb-1.5 ${brandColor} ${product.brand === 'Vika' ? 'italic' : ''}`}>
                    {product.brand === 'Vika' ? <><span className="-skew-x-12 inline-block">v</span>ika</> : product.brand}
                  </div>

                  {/* Title & Part number */}
                  <div className="font-bold text-[#1C1C1C] text-[15px] mb-1 leading-snug">
                    {name}
                  </div>
                  <div className="text-[13px] font-medium text-gray-400 mb-4">
                    {product.partNumber}
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-end justify-between mt-auto">
                    {/* Rating (Right visually in RTL, but we'll use flex layout) */}
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[#FFB300] fill-[#FFB300]" />
                      <span className="font-bold text-gray-700 text-sm mt-0.5">{product.rating}</span>
                    </div>

                    {/* Price or Login to View */}
                    {isMerchantLoggedIn ? (
                      <div className="flex flex-col items-end" dir={isRTL ? "rtl" : "ltr"}>
                        <div className="flex items-baseline gap-1.5 text-gray-400 line-through">
                          <span className="font-bold text-sm">{product.originalPrice}</span>
                          <span className="text-[10px] font-bold">{isRTL ? 'ج.م' : 'EGP'}</span>
                        </div>
                        <div className="flex items-baseline gap-1 text-red-600">
                          <span className="font-black text-xl leading-none">{product.retailPrice}</span>
                          <span className="text-xs font-bold">{isRTL ? 'ج.م' : 'EGP'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-2 rounded-lg border border-gray-200">
                        {isRTL ? 'سجل كتاجر لعرض السعر' : 'Login as dealer to view price'}
                      </div>
                    )}
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProductsGrid;
