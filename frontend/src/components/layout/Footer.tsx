import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Share2, AtSign, Play, Globe2, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <footer className="bg-[#111827] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12" dir={isRTL ? "rtl" : "ltr"}>
        
        {/* Column 1: About (Rightmost in RTL) */}
        <div className="flex flex-col">
          <h4 className="text-white font-bold text-lg mb-6">
            {isRTL ? 'عن نماء المتحدة' : 'About Namā United'}
          </h4>
          <p className="text-[13px] text-gray-400 leading-relaxed font-medium mb-4">
            {isRTL ? 'نماء المتحدة للتجارة والتوزيع' : 'Namā United Trading & Distribution'}
            <br />
            {isRTL ? 'استيراد وتوزيع أفضل قطع غيار السيارات من ماركات عالمية موثوقة لجودة تدوم وأداء يعتمد عليه.' : 'Importing and distributing the best auto parts from reliable international brands for lasting quality and dependable performance.'}
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col">
          <h4 className="text-white font-bold text-lg mb-6">
            {isRTL ? 'روابط سريعة' : 'Quick Links'}
          </h4>
          <ul className="space-y-3">
            {[
              { ar: 'المنتجات', en: 'Products', to: '/products' },
              { ar: 'التوكيلات', en: 'Agencies', to: '/agencies' },
              { ar: 'دليل التجار', en: 'Dealers', to: '/dealers' },
              { ar: 'عروض وخصومات', en: 'Offers', to: '/offers' },
              { ar: 'تواصل معنا', en: 'Contact Us', to: '/contact' },
            ].map((link) => (
              <li key={link.en}>
                <Link to={link.to} className="text-[13px] text-gray-400 hover:text-white transition-colors">
                  {isRTL ? link.ar : link.en}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/blog" className="text-[13px] text-gray-400 hover:text-white transition-colors">
                {isRTL ? 'المدونة' : 'Blog'}
              </Link>
            </li>
            <li>
              <Link to="/warranty" className="text-[13px] text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <ShieldCheck size={14}/> {isRTL ? 'تفعيل الضمان' : 'Activate Warranty'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Brands & Apps */}
        <div className="flex flex-col">
          <h4 className="text-white font-bold text-lg mb-6">
            {isRTL ? 'التوكيلات' : 'Brands'}
          </h4>
          <ul className="space-y-3 mb-8">
            {['Borsehung', 'Vika', 'KDD'].map((brand) => (
              <li key={brand}>
                <Link to={`/products?brand=${brand}`} className="text-[13px] text-gray-400 hover:text-white transition-colors">
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
          
          <h4 className="text-white font-bold text-lg mb-4">
            {isRTL ? 'تطبيق نماء الموحد' : 'NUTD App'}
          </h4>
          <div className="flex flex-col gap-3">
            <a href="#" className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors w-44">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
            </a>
            <a href="#" className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors w-44">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8" />
            </a>
          </div>
        </div>

        {/* Column 4: Contact Us & Social (Leftmost in RTL) */}
        <div className="flex flex-col">
          <h4 className="text-white font-bold text-lg mb-6">
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
          </h4>
          <ul className="space-y-4 mb-6">
            <li>
              <a href="tel:+201001234567" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone size={16} className="shrink-0" />
                <span className="text-[13px]" dir="ltr">+20 100 123 4567</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@nutd.com.eg" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail size={16} className="shrink-0" />
                <span className="text-[13px]">info@nutd.com.eg</span>
              </a>
            </li>
            <li>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} className="shrink-0" />
                <span className="text-[13px]">
                  {isRTL ? 'القاهرة - جمهورية مصر العربية' : 'Cairo - Egypt'}
                </span>
              </div>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[Share2, AtSign, Play, Globe2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-12" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <span className="text-[13px] text-gray-500 font-medium">
            {isRTL ? 'جميع الحقوق محفوظة © 2024 نماء المتحدة للتجارة والتوزيع' : 'All rights reserved © 2024 Namā United Trading & Distribution'}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
