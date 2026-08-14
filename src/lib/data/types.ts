export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  merchant: 'Amazon' | 'Flipkart' | 'Other';
  affiliateUrl: string;
  productImage: string;
  threeDAsset?: string;
  specifications: Record<string, string>;
  features: string[];
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentCategory?: string;
}

export interface Deal extends Product {
  expiresAt?: string;
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  published: boolean;
}
