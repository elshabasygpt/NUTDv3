import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO = ({ title, description, keywords, image, url }: SEOProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const defaultTitle = isRTL ? 'نماء المتحدة | استيراد وتوزيع قطع غيار السيارات' : 'NUTD | Auto Parts Import & Distribution';
  const defaultDescription = isRTL 
    ? 'المورد الأول لقطع غيار السيارات الأوروبية في مصر والشرق الأوسط. وكلاء حصريون لكبرى العلامات التجارية.'
    : 'The premier supplier of European auto parts in Egypt and the Middle East. Exclusive agents for major brands.';
  
  const defaultKeywords = isRTL 
    ? 'قطع غيار, سيارات, سيارات أوروبية, فولكس فاجن, سكودا, أودي, جملة قطع غيار'
    : 'auto parts, spare parts, european cars, vw, skoda, audi, wholesale auto parts';

  const siteTitle = title ? `${title} | ${isRTL ? 'نماء المتحدة' : 'NUTD'}` : defaultTitle;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || window.location.href} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Html Lang Dir */}
      <html lang={i18n.language} dir={isRTL ? 'rtl' : 'ltr'} />
    </Helmet>
  );
};

export default SEO;
