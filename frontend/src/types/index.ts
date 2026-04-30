export interface Product {
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
  image?: string;
  rating?: number;
  reviews?: number;
  createdAt?: string;
}

export interface Dealer {
  id: string;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  companyName: string;
  city: string;
  address?: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  latitude?: number;
  longitude?: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: Dealer;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subTotal: number;
  total: number;
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  brand?: string;
  category?: string;
  lang?: 'ar' | 'en';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice?: number;
  total?: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subTotal?: number;
  discount?: number;
  total?: number;
}

export interface HeroSlide {
  id: number;
  image: string;
}

export interface MakeOption {
  value: string;
  labelAr: string;
  labelEn: string;
  icon: string;
}

export interface HeroSettings {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  slides: HeroSlide[];
  makes: MakeOption[];
  models: string[];
  years: string[];
  engines: string[];
  partTypes: string[];
}

export interface FeatureSettings {
  id: number;
  icon: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

export interface PromoBannerSettings {
  id: number;
  logoUrl?: string;
  logoText?: string;
  logoColor?: string;
  taglineAr: string;
  taglineEn: string;
  descAr: string;
  descEn: string;
  bgColor: string;
  btnColor: string;
  imgUrl: string;
}

export interface CarModelSettings {
  id: number;
  name: string;
  labelAr: string;
  image: string;
}

export interface CarMakeSettings {
  id: number;
  name: string;
  labelAr: string;
  icon: string;
  models: CarModelSettings[];
}

export interface SubCategorySettings {
  id: string;
  nameEN: string;
  nameAR: string;
  image: string;
}

export interface CategorySettings {
  id: string;
  nameEN: string;
  nameAR: string;
  image: string;
  subcategories: SubCategorySettings[];
}

export interface WholesaleOfferSettings {
  id: string;
  name: string;
  brand: string;
  oeNumber: string;
  partNumber: string;
  packageType: string;
  moq: number;
  oldPrice: number;
  newPrice: number;
  savings: number;
  stock: string;
  image: string;
}

export interface SiteSettings {
  header_phone?: string;
  header_logo?: string;
  header_nav?: string;
  homepage_hero?: string; // JSON string of HeroSettings
  homepage_features?: string; // JSON string of FeatureSettings[]
  homepage_brands?: string; // JSON string of PromoBannerSettings[]
  homepage_carmakes?: string; // JSON string of CarMakeSettings[]
  homepage_categories?: string; // JSON string of CategorySettings[]
  homepage_wholesale?: string; // JSON string of WholesaleOfferSettings[]
}
