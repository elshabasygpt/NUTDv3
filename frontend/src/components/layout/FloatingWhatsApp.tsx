import { useTranslation } from 'react-i18next';

const FloatingWhatsApp = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Replace with the actual WhatsApp number of the company
  const phoneNumber = "201012345678"; 
  const message = isRTL 
    ? "مرحباً، أحتاج إلى مساعدة بخصوص قطع الغيار." 
    : "Hello, I need help with spare parts.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50`}>
      {/* Tooltip (visible on hover) */}
      <div className="absolute bottom-full mb-3 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white text-gray-800 text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg border border-gray-100 whitespace-nowrap">
          {isRTL ? 'تواصل معنا' : 'Chat with us'}
        </div>
      </div>
      
      {/* WhatsApp Button */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="WhatsApp Chat"
      >
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        
        {/* WhatsApp SVG Icon */}
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:scale-110 transition-transform duration-300"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
