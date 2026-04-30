import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { defaultHero, defaultFeatures, defaultBrands, defaultCarMakes, defaultCategories, defaultWholesale, defaultPremiumDealers } from '../utils/defaultSettings';
import type { HeroSettings, FeatureSettings, PromoBannerSettings, CarMakeSettings, CategorySettings, WholesaleSettings, PremiumDealerSettings } from '../types';

export interface NavLink {
  labelEN: string;
  labelAR: string;
  to: string;
}

interface Settings {
  header_phone: string;
  header_logo: string;
  header_nav: NavLink[];
  homepage_hero?: HeroSettings;
  homepage_features?: FeatureSettings[];
  homepage_brands?: PromoBannerSettings[];
  homepage_carmakes?: CarMakeSettings[];
  homepage_categories?: CategorySettings[];
  homepage_wholesale?: WholesaleSettings;
  homepage_dealers?: PremiumDealerSettings[];
}

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  header_phone: '+20 100 123 4567',
  header_logo: '/assets/images/nutd-logo.svg',
  header_nav: [
    { labelEN: 'Home', labelAR: 'الرئيسية', to: '/' },
    { labelEN: 'Products', labelAR: 'المنتجات', to: '/products' },
    { labelEN: 'Agencies', labelAR: 'التوكيلات', to: '/agencies' },
    { labelEN: 'Dealers', labelAR: 'أقرب تاجر', to: '/dealers' },
    { labelEN: 'Blog', labelAR: 'المدونة', to: '/blog' },
    { labelEN: 'Wholesale Offers', labelAR: 'عروض الجملة', to: '/offers' },
    { labelEN: 'About', labelAR: 'من نحن', to: '/about' },
    { labelEN: 'Contact', labelAR: 'تواصل معنا', to: '/contact' }
  ],
  homepage_hero: defaultHero,
  homepage_features: defaultFeatures,
  homepage_brands: defaultBrands,
  homepage_carmakes: defaultCarMakes,
  homepage_categories: defaultCategories,
  homepage_wholesale: defaultWholesale,
  homepage_dealers: defaultPremiumDealers
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.success && res.data.data) {
        const rawData = res.data.data;
        
        const parsedHero = rawData.homepage_hero ? JSON.parse(rawData.homepage_hero) : null;
        const parsedFeatures = rawData.homepage_features ? JSON.parse(rawData.homepage_features) : [];
        const parsedBrands = rawData.homepage_brands ? JSON.parse(rawData.homepage_brands) : [];
        const parsedCarMakes = rawData.homepage_carmakes ? JSON.parse(rawData.homepage_carmakes) : [];
        const parsedCategories = rawData.homepage_categories ? JSON.parse(rawData.homepage_categories) : [];
        const parsedWholesale = rawData.homepage_wholesale ? JSON.parse(rawData.homepage_wholesale) : null;
        const parsedDealers = rawData.homepage_dealers ? JSON.parse(rawData.homepage_dealers) : [];

        setSettings({
          ...rawData,
          header_nav: typeof rawData.header_nav === 'string' 
            ? JSON.parse(rawData.header_nav) 
            : rawData.header_nav || defaultSettings.header_nav,
          homepage_hero: parsedHero && Object.keys(parsedHero).length > 0 ? parsedHero : defaultHero,
          homepage_features: parsedFeatures.length > 0 ? parsedFeatures : defaultFeatures,
          homepage_brands: parsedBrands.length > 0 ? parsedBrands : defaultBrands,
          homepage_carmakes: parsedCarMakes.length > 0 ? parsedCarMakes : defaultCarMakes,
          homepage_categories: parsedCategories.length > 0 ? parsedCategories : defaultCategories,
          homepage_wholesale: parsedWholesale && Object.keys(parsedWholesale).length > 0 ? parsedWholesale : defaultWholesale,
          homepage_dealers: parsedDealers.length > 0 ? parsedDealers : defaultPremiumDealers
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
